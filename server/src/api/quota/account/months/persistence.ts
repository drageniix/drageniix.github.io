import { BudgetMonth, BudgetMonthInternalProperties } from ".";
import * as BudgetAccountController from "..";
import {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../../gateway/persistence";

const dateRegex = new RegExp(/^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/, "g");

export const createAccountMonth = (parameters: {
  explicit?: BudgetMonthInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetMonth => new BudgetMonth(parameters);

export const postAccountMonth = async (
  month: BudgetMonth
): Promise<BudgetMonth> => {
  await postModelToCollection(
    month,
    month.accountId.collection(CollectionTypes.MONTHS)
  );

  return month;
};

export const createAndPostAccountMonth = async (
  explicit: BudgetMonthInternalProperties
): Promise<BudgetMonth> => postAccountMonth(createAccountMonth({ explicit }));

export const updateMonth = async (
  month: BudgetMonth,
  {
    balance,
  }: {
    balance?: number;
  }
): Promise<BudgetMonth> => {
  month.balance = balance || month.balance;
  await updateModel(month);
  return month;
};

export const getAllAccountMonths = async (
  userRef: DocumentReference,
  accountId: documentReferenceType,
  { endBefore }: { endBefore?: Date } = {}
): Promise<BudgetMonth[]> => {
  let query = BudgetAccountController.getAccountReferenceById(
    userRef,
    accountId
  )
    .collection(CollectionTypes.MONTHS)
    .orderBy("date", "desc");

  if (endBefore) {
    query = query.endBefore(endBefore);
  }

  return query
    .get()
    .then((months) =>
      months.docs.map((snapshot) => createAccountMonth({ snapshot }))
    );
};

export const getAccountMonthReferenceById = (
  accountRef: DocumentReference,
  monthRef: documentReferenceType
): DocumentReference =>
  getDocumentReference(accountRef, monthRef, CollectionTypes.MONTHS);

export const getAccountMonth = async (
  userRef: DocumentReference,
  {
    accountId,
    monthId,
  }: {
    accountId: documentReferenceType;
    monthId: documentReferenceType;
  }
): Promise<BudgetMonth> => {
  const account = await BudgetAccountController.getAccount(userRef, {
    accountId,
  });

  if (
    typeof monthId == "string" &&
    (monthId === "current" || monthId.match(dateRegex))
  ) {
    const date = monthId === "current" ? new Date() : new Date(monthId);
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    // search
    return account.id
      .collection("months")
      .orderBy("date")
      .startAt(startDate)
      .endBefore(endDate)
      .get()
      .then((months) =>
        months.docs.length === 1
          ? createAccountMonth({ snapshot: months.docs[0] })
          : createAndPostAccountMonth({
              date: startDate,
              userId: account.userId,
              accountId: account.id,
            })
      );
  } else {
    return getAccountMonthReferenceById(account.id, monthId)
      .get()
      .then((month) => createAccountMonth({ snapshot: month }));
  }
};

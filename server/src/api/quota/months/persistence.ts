import { BudgetMonth, BudgetMonthInternalProperties } from ".";
import {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../../gateway/persistence";

export const createMonth = (parameters: {
  explicit?: BudgetMonthInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetMonth => new BudgetMonth(parameters);

export const postMonth = async (month: BudgetMonth): Promise<BudgetMonth> => {
  await postModelToCollection(
    month,
    month.userId.collection(CollectionTypes.MONTHS)
  );

  return month;
};

export const createAndPostMonth = async (
  explicit: BudgetMonthInternalProperties
): Promise<BudgetMonth> => postMonth(createMonth({ explicit }));

export const updateMonth = async (
  month: BudgetMonth,
  {
    amount,
    oldBudget,
    newBudget,
  }: {
    amount?: number;
    oldBudget?: number;
    newBudget?: number;
  }
): Promise<BudgetMonth> => {
  if (amount) {
    month.balance += amount;
    month.activity += amount;
  }
  if (oldBudget && newBudget) {
    month.budgeted -= oldBudget;
    month.budgeted += newBudget;
  }
  await updateModel(month);
  return month;
};

export const getAllMonths = async (
  userRef: DocumentReference
): Promise<BudgetMonth[]> =>
  userRef
    .collection(CollectionTypes.MONTHS)
    .orderBy("date", "desc")
    .get()
    .then((months) => months.docs.map((snapshot) => createMonth({ snapshot })));

export const getMonth = async (
  userRef: DocumentReference,
  {
    ref,
    date,
  }: {
    ref?: documentReferenceType;
    date?: Date;
  }
): Promise<BudgetMonth> => {
  if (date) {
    const startDate = new Date(date);
    startDate.setDate(1);

    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    // search
    return userRef
      .collection(CollectionTypes.MONTHS)
      .orderBy("date")
      .startAt(startDate)
      .endBefore(endDate)
      .get()
      .then((months) =>
        months.docs.length === 1
          ? createMonth({ snapshot: months.docs[0] })
          : createAndPostMonth({ date: startDate, userId: userRef })
      );
  } else if (ref) {
    return getDocumentReference(userRef, ref, CollectionTypes.MONTHS)
      .get()
      .then((month) => createMonth({ snapshot: month }));
  }
};

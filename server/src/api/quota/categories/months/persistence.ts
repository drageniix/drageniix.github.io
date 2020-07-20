import { BudgetMonth, BudgetMonthInternalProperties } from ".";
import * as BudgetCategoryController from "..";
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

export const createMonth = (parameters: {
  explicit?: BudgetMonthInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetMonth => new BudgetMonth(parameters);

export const postMonth = async (month: BudgetMonth): Promise<BudgetMonth> => {
  await postModelToCollection(
    month,
    month.categoryId.collection(CollectionTypes.MONTHS)
  );

  return month;
};

export const createAndPostMonth = async (
  explicit: BudgetMonthInternalProperties
): Promise<BudgetMonth> => postMonth(createMonth({ explicit }));

export const updateCategoryMonth = async (
  month: BudgetMonth,
  {
    activity,
    carryOverBalance,
    budget,
  }: {
    activity?: number;
    carryOverBalance?: number;
    budget?: number;
  } = {}
): Promise<BudgetMonth> => {
  if (activity) {
    month.activity += activity;
  }

  month.carryOverBalance = carryOverBalance || month.carryOverBalance;
  month.budgeted = budget || month.budgeted;
  month.balance = month.activity + month.budgeted + month.carryOverBalance;

  await updateModel(month);
  return month;
};

export const getAllMonths = async (
  userRef: DocumentReference,
  categoryId: documentReferenceType,
  { endBefore }: { endBefore?: Date } = {}
): Promise<BudgetMonth[]> => {
  let query = BudgetCategoryController.getCategoryReferenceById(
    userRef,
    categoryId
  )
    .collection(CollectionTypes.MONTHS)
    .orderBy("date", "desc");

  if (endBefore) {
    query = query.endBefore(endBefore);
  }

  return query
    .get()
    .then((months) => months.docs.map((snapshot) => createMonth({ snapshot })));
};

export const getMonthReferenceById = (
  categoryRef: DocumentReference,
  monthRef: documentReferenceType
): DocumentReference =>
  getDocumentReference(categoryRef, monthRef, CollectionTypes.MONTHS);

export const getMonth = async (
  userRef: DocumentReference,
  {
    categoryId,
    monthId,
  }: {
    categoryId: documentReferenceType;
    monthId: documentReferenceType;
  }
): Promise<BudgetMonth> => {
  const category = await BudgetCategoryController.getCategory(userRef, {
    categoryId,
  });

  if (
    typeof monthId == "string" &&
    (monthId === "current" || monthId.match(dateRegex))
  ) {
    const date = monthId === "current" ? new Date() : new Date(monthId);
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    // search
    return category.id
      .collection("months")
      .orderBy("date")
      .startAt(startDate)
      .endBefore(endDate)
      .get()
      .then((months) =>
        months.docs.length === 1
          ? createMonth({ snapshot: months.docs[0] })
          : createAndPostMonth({
              date: startDate,
              userId: category.userId,
              categoryId: category.id,
            })
      );
  } else {
    return getMonthReferenceById(category.id, monthId)
      .get()
      .then((month) => createMonth({ snapshot: month }));
  }
};

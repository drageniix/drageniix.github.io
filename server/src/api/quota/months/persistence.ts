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
import * as BudgetCategoryController from "../categories";

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
  categoryRef: DocumentReference
): Promise<BudgetMonth[]> =>
  categoryRef
    .collection(CollectionTypes.MONTHS)
    .orderBy("date", "desc")
    .get()
    .then((months) => months.docs.map((snapshot) => createMonth({ snapshot })));

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
    date,
  }: {
    categoryId: documentReferenceType;
    monthId?: documentReferenceType;
    date?: Date;
  }
): Promise<BudgetMonth> => {
  const category = await BudgetCategoryController.getCategory(userRef, {
    categoryId,
  });

  if (date) {
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
  } else if (monthId) {
    return getDocumentReference(category.id, monthId)
      .get()
      .then((month) => createMonth({ snapshot: month }));
  }
};

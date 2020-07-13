import { firestore } from "firebase-admin";
import {
  CollectionTypes,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../middleware/persistence";
import BudgetMonth, { BudgetMonthInternalProperties } from "../models/Month";

export const createMonth = (parameters: {
  explicit?: BudgetMonthInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetMonth => new BudgetMonth(parameters);

export const postMonth = async (model: BudgetMonth): Promise<BudgetMonth> => {
  await postModelToCollection(
    model,
    model.userId.collection(CollectionTypes.MONTHS)
  );

  return model;
};

export const createAndPostMonth = async (
  explicit: BudgetMonthInternalProperties
): Promise<BudgetMonth> => postMonth(createMonth({ explicit }));

export const updateMonth = async (
  model: BudgetMonth,
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
    model.balance += amount;
    model.activity += amount;
  }
  if (oldBudget && newBudget) {
    model.budgeted -= oldBudget;
    model.budgeted += newBudget;
  }
  await updateModel(model);
  return model;
};

export const getAllMonths = async (
  userRef: firestore.DocumentReference
): Promise<BudgetMonth[]> => {
  return userRef
    .collection(CollectionTypes.MONTHS)
    .orderBy("date", "desc")
    .get()
    .then((months) => months.docs.map((snapshot) => createMonth({ snapshot })));
};

export const getMonth = async (
  userRef: firestore.DocumentReference,
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

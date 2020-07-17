import { BudgetScheduled, BudgetScheduledInternalProperties } from ".";
import { getAccountReferenceById } from "../account";
import { getCategoryReferenceById } from "../categories";
import {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  Query,
  updateModel,
} from "../gateway/persistence";
import { getPayeeReferenceById } from "../payees";

export const createScheduled = (parameters: {
  explicit?: BudgetScheduledInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetScheduled => new BudgetScheduled(parameters);

export const postScheduled = async (
  scheduled: BudgetScheduled
): Promise<BudgetScheduled> => {
  const collectionRef = scheduled.userId.collection(
    CollectionTypes.SCHEDULED_TRANSACTIONS
  );
  await postModelToCollection(scheduled, collectionRef);
  return scheduled;
};

export const postScheduleds = async (
  scheduledTransactions: BudgetScheduled[]
): Promise<BudgetScheduled[]> =>
  Promise.all(
    scheduledTransactions.map((scheduled) => postScheduled(scheduled))
  );

export const createAndPostScheduled = (
  explicit: BudgetScheduledInternalProperties
): Promise<BudgetScheduled> => postScheduled(createScheduled({ explicit }));

export const getAllScheduleds = async (
  userRef: DocumentReference,
  {
    accountId,
    payeeId,
    categoryId,
    flagColor,
    limit,
    scheduledUntil,
  }: {
    accountId?: documentReferenceType;
    payeeId?: documentReferenceType;
    categoryId?: documentReferenceType;
    flagColor?: string;
    limit?: number;
    scheduledUntil?: Date;
  } = {}
): Promise<BudgetScheduled[]> => {
  let query: Query = userRef
    .collection(CollectionTypes.SCHEDULED_TRANSACTIONS)
    .orderBy("date", "asc");

  if (scheduledUntil) {
    query = query.endBefore(scheduledUntil);
  }

  if (accountId || payeeId || categoryId) {
    if (accountId) {
      const account = getAccountReferenceById(userRef, accountId);
      query = query.where("accountId", "==", account);
    } else if (payeeId) {
      const payee = getPayeeReferenceById(userRef, payeeId);
      query = query.where("payeeId", "==", payee);
    } else if (categoryId) {
      const category = getCategoryReferenceById(userRef, categoryId);
      query = query.where("categoryId", "==", category);
    }
  }

  if (flagColor) {
    query = query.where("flagColor", "==", flagColor);
  }

  if (limit) {
    query = query.limit(limit);
  }

  return query
    .get()
    .then((scheduledTransactions) =>
      scheduledTransactions.docs.map((snapshot) =>
        createScheduled({ snapshot })
      )
    );
};

export const getScheduledReferenceById = (
  userRef: DocumentReference,
  scheduled: documentReferenceType
): DocumentReference =>
  getDocumentReference(
    userRef,
    scheduled,
    CollectionTypes.SCHEDULED_TRANSACTIONS
  );

export const getScheduled = async (
  userRef: DocumentReference,
  ref: documentReferenceType
): Promise<BudgetScheduled> =>
  getScheduledReferenceById(userRef, ref)
    .get()
    .then((snapshot) => createScheduled({ snapshot }));

export const updateScheduled = async (
  model: BudgetScheduled,
  {
    accountId,
    accountName,
    payeeId,
    payeeName,
    categoryId,
    categoryName,
    amount,
    date,
    note,
    frequency,
    flagColor,
  }: {
    amount?: number;
    date?: Date;
    accountId?: DocumentReference;
    accountName?: string;
    payeeId?: DocumentReference;
    payeeName?: string;
    categoryName?: string;
    categoryId?: DocumentReference;
    note?: string;
    frequency?: string;
    flagColor?: string;
  }
): Promise<BudgetScheduled> => {
  model.amount = amount || model.amount;
  model.date = date || model.date;
  model.accountId = accountId || model.accountId;
  model.accountName = accountName || model.accountName;
  model.payeeName = payeeName || model.payeeName;
  model.payeeId = payeeId || model.payeeId;
  model.categoryName = categoryName || model.categoryName;
  model.categoryId = categoryId || model.categoryId;
  model.note = note || model.note;
  model.frequency = frequency || model.frequency;
  model.flagColor = flagColor || model.flagColor;
  updateModel(model);
  return model;
};

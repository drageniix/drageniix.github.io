import {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  Query,
  updateModel,
} from "../middleware/persistence";
import BudgetTransaction, {
  BudgetTransactionInternalProperties,
} from "../models/Transaction";
import { getAccountReferenceById } from "./account";
import { getCategoryReferenceById } from "./category";
import { getPayeeReferenceById } from "./payee";

export const createTransaction = (parameters: {
  explicit?: BudgetTransactionInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetTransaction => new BudgetTransaction(parameters);

export const postTransaction = async (
  model: BudgetTransaction
): Promise<BudgetTransaction> => {
  await postModelToCollection(
    model,
    model.userId.collection(CollectionTypes.TRANSACTIONS)
  );
  return model;
};

export const createAndPostTransaction = (
  explicit: BudgetTransactionInternalProperties
): Promise<BudgetTransaction> =>
  postTransaction(createTransaction({ explicit }));

export const getAllTransactions = async (
  userRef: DocumentReference,
  {
    accountRef,
    payeeRef,
    categoryRef,
    limit,
  }: {
    accountRef?: documentReferenceType;
    payeeRef?: documentReferenceType;
    categoryRef?: documentReferenceType;
    limit?: number;
  } = {}
): Promise<BudgetTransaction[]> => {
  let query: Query = userRef
    .collection(CollectionTypes.TRANSACTIONS)
    .orderBy("date", "asc");

  if (accountRef || payeeRef || categoryRef) {
    if (accountRef) {
      const accountId = getAccountReferenceById(userRef, accountRef);
      query = query.where("accountId", "==", accountId);
    } else if (payeeRef) {
      const payeeId = getPayeeReferenceById(userRef, payeeRef);
      query = query.where("payeeId", "==", payeeId);
    } else if (categoryRef) {
      const categoryId = getCategoryReferenceById(userRef, categoryRef);
      query = query.where("categoryId", "==", categoryId);
    }
  }

  if (limit) {
    query = query.limit(limit);
  }

  return query
    .get()
    .then((transactions) =>
      transactions.docs.map((snapshot) => createTransaction({ snapshot }))
    );
};

export const getTransaction = async (
  userRef: DocumentReference,
  ref: documentReferenceType
): Promise<BudgetTransaction> => {
  return getDocumentReference(userRef, ref, CollectionTypes.TRANSACTIONS)
    .get()
    .then((snapshot) => createTransaction({ snapshot }));
};

export const updateTransaction = async (
  model: BudgetTransaction,
  {
    accountId,
    accountName,
    payeeId,
    payeeName,
    categoryId,
    categoryName,
    amount,
    date,
  }: {
    amount?: number;
    date?: Date;
    accountId?: DocumentReference;
    accountName?: string;
    payeeId?: DocumentReference;
    payeeName?: string;
    categoryName?: string;
    categoryId?: DocumentReference;
  }
): Promise<BudgetTransaction> => {
  model.amount = amount || model.amount;
  model.date = date || model.date;
  model.accountId = accountId || model.accountId;
  model.accountName = accountName || model.accountName;
  model.payeeName = payeeName || model.payeeName;
  model.payeeId = payeeId || model.payeeId;
  model.categoryName = categoryName || model.categoryName;
  model.categoryId = categoryId || model.categoryId;
  updateModel(model);
  return model;
};

import { BudgetTransaction, BudgetTransactionInternalProperties } from ".";
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
  updateModel
} from "../gateway/persistence";
import { getPayeeReferenceById } from "../payees";

export const createTransaction = (parameters: {
  explicit?: BudgetTransactionInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetTransaction => new BudgetTransaction(parameters);

export const postTransaction = async (
  transaction: BudgetTransaction
): Promise<BudgetTransaction> => {
  const collectionRef = transaction.userId.collection(
    CollectionTypes.TRANSACTIONS
  );
  if (transaction.plaidTransactionId) {
    const existing = await collectionRef
      .where("plaidTransactionId", "==", transaction.plaidTransactionId)
      .get();
    if (existing.docs.length === 0) {
      await postModelToCollection(transaction, collectionRef);
    }
  } else {
    await postModelToCollection(transaction, collectionRef);
  }
  return transaction;
};

export const postTransactions = async (
  transactions: BudgetTransaction[]
): Promise<BudgetTransaction[]> =>
  Promise.all(transactions.map((transaction) => postTransaction(transaction)));

export const createAndPostTransaction = (
  explicit: BudgetTransactionInternalProperties
): Promise<BudgetTransaction> =>
  postTransaction(createTransaction({ explicit }));

export const getAllTransactions = async (
  userRef: DocumentReference,
  {
    accountId,
    payeeId,
    categoryId,
    flagColor,
    limit,
    cleared,
    startDate,
    endDate,
  }: {
    accountId?: documentReferenceType;
    payeeId?: documentReferenceType;
    categoryId?: documentReferenceType;
    flagColor?: string;
    limit?: number;
    cleared?: boolean;
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<BudgetTransaction[]> => {
  let query: Query = userRef
    .collection(CollectionTypes.TRANSACTIONS)
    .orderBy("date", "asc");

  if (startDate && endDate) {
    query = query.startAt(new Date(startDate)).endBefore(new Date(endDate));
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

  if (cleared) {
    query = query.where("cleared", "==", cleared);
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

export const getTransactionReferenceById = (
  userRef: DocumentReference,
  transaction: documentReferenceType
): DocumentReference =>
  getDocumentReference(userRef, transaction, CollectionTypes.TRANSACTIONS);

export const getTransaction = async (
  userRef: DocumentReference,
  ref: documentReferenceType
): Promise<BudgetTransaction> =>
  getTransactionReferenceById(userRef, ref)
    .get()
    .then((snapshot) => createTransaction({ snapshot }));

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
    note,
    cleared,
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
    flagColor?: string;
    cleared?: boolean;
  } = {}
): Promise<BudgetTransaction> => {
  model.amount = amount || model.amount;
  model.date = date || model.date;
  model.accountId = accountId || model.accountId;
  model.accountName = accountName || model.accountName;
  model.payeeName = payeeName || model.payeeName;
  model.payeeId = payeeId || model.payeeId;
  model.categoryName = categoryName || model.categoryName;
  model.categoryId = categoryId || model.categoryId;
  model.note = note || model.note;
  model.cleared = cleared || model.cleared;
  model.flagColor = flagColor || model.flagColor;
  updateModel(model);
  return model;
};

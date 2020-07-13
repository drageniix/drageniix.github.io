import { BudgetTransactionController } from ".";
import {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../middleware/persistence";
import BudgetAccount, {
  BudgetAccountInternalProperties,
} from "../models/Account";
import BudgetTransactionPayee from "../models/Payee";
import { createAndPostPayee, getPayee, updatePayee } from "./payee";

export const updateLinkedAccountName = async (
  account: BudgetAccount
): Promise<BudgetAccount> => {
  //Update transactions connected to the account
  await BudgetTransactionController.getAllTransactions(account.userId, {
    account: account.id,
  }).then((transactions) =>
    Promise.all(
      transactions.map((transaction) =>
        BudgetTransactionController.updateTransaction(transaction, {
          accountName: account.name,
        })
      )
    )
  );

  // Update payee connected to the account, and all transactions with that payee
  await getPayee(account.userId, {
    payeeRef: account.transferPayeeId,
  })
    .then((payee) => {
      payee.name = "TRANSFER " + account.name;
      return updatePayee(payee, {
        transferAccountName: account.name,
      });
    })
    .then((payee) =>
      BudgetTransactionController.getAllTransactions(account.userId, {
        payee: payee.id,
      }).then((transactions) =>
        Promise.all(
          transactions.map((transaction) =>
            BudgetTransactionController.updateTransaction(transaction, {
              payeeName: payee.name,
            })
          )
        )
      )
    );

  return account;
};

export const updateAccount = async (
  account: BudgetAccount,
  {
    name,
    transferPayeeName,
    transferPayeeId,
  }: {
    name?: string;
    transferPayeeName?: string;
    transferPayeeId?: DocumentReference;
  } = {}
): Promise<BudgetAccount> => {
  account.name = name;
  account.transferPayeeName = transferPayeeName || account.transferPayeeName;
  account.transferPayeeId = transferPayeeId || account.transferPayeeId;
  await updateModel(account);
  return account;
};

export const createMatchingPayee = async (
  account: BudgetAccount
): Promise<{ payee: BudgetTransactionPayee; account: BudgetAccount }> => {
  // Create equivalent payee for transfers
  const payee = await createAndPostPayee({
    userId: account.userId,
    name: `TRANSFER: ${account.name}`,
    transferAccountId: account.id,
    transferAccountName: account.name,
  });

  await updateAccount(account, {
    transferPayeeId: payee.id,
    transferPayeeName: payee.name,
  });

  return { account: account, payee };
};

export const createAccount = (parameters: {
  explicit?: BudgetAccountInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetAccount => new BudgetAccount(parameters);

export const postAccount = async (
  account: BudgetAccount
): Promise<BudgetAccount> => {
  await postModelToCollection(
    account,
    account.userId.collection(CollectionTypes.ACCOUNTS)
  );
  return account;
};

export const createAndPostAccount = (
  explicit: BudgetAccountInternalProperties
): Promise<BudgetAccount> => postAccount(createAccount({ explicit }));

export const getAccount = async (
  userRef: DocumentReference,
  {
    accountRef,
    plaidAccountId,
  }: {
    accountRef?: documentReferenceType;
    plaidAccountId?: string;
  }
): Promise<BudgetAccount> => {
  if (plaidAccountId) {
    return userRef
      .collection(CollectionTypes.ACCOUNTS)
      .where("plaidAccountId", "==", plaidAccountId)
      .get()
      .then(
        (accounts) =>
          accounts.docs.length === 1 &&
          createAccount({ snapshot: accounts.docs[0] })
      );
  } else if (accountRef) {
    return getDocumentReference(userRef, accountRef, CollectionTypes.ACCOUNTS)
      .get()
      .then((account) => account && createAccount({ snapshot: account }));
  } else return null;
};

export const getAllAccounts = async (
  userRef: DocumentReference
): Promise<BudgetAccount[]> => {
  const query = userRef
    .collection(CollectionTypes.ACCOUNTS)
    .where("hidden", "==", false);

  return query
    .get()
    .then((categories) =>
      categories.docs.map((snapshot) => createAccount({ snapshot }))
    );
};

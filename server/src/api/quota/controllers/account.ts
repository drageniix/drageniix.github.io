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

const updateAccountName = async (
  model: BudgetAccount,
  name: string
): Promise<void> => {
  model.name = name;

  // await BudgetTransaction.getAllTransactions(model.userId, {
  //   account: model,
  // }).then((transactions) =>
  //   Promise.all(
  //     transactions.map((transaction) => {
  //       transaction.setLinkedValues({
  //         accountName: model.name,
  //       });
  //       return transaction.update();
  //     })
  //   )
  // );

  await getPayee(model.userId, {
    payeeRef: model.transferPayeeId,
  }).then((payee) => {
    payee.name = "TRANSFER " + model.name;
    updatePayee(payee, {
      transferAccountName: model.name,
    });
  });
  // .then((payee) =>
  //   BudgetTransaction.getAllTransactions(model.userId, {
  //     payee,
  //   }).then((transactions) =>
  //     Promise.all(
  //       transactions.map((transaction) => {
  //         transaction.setLinkedValues({
  //           payeeName: model.name,
  //         });
  //         return transaction.update();
  //       })
  //     )
  //   )
  // );
};

export const updateAccount = async (
  model: BudgetAccount,
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
  name && (await updateAccountName(model, name));
  model.transferPayeeName = transferPayeeName || model.transferPayeeName;
  model.transferPayeeId = transferPayeeId || model.transferPayeeId;
  await updateModel(model);
  return model;
};

export const createAccount = (parameters: {
  explicit?: any; //eslint-disable-line
  snapshot?: DocumentSnapshot;
}): BudgetAccount => new BudgetAccount(parameters);

export const createMatchingPayee = async (
  model: BudgetAccount
): Promise<BudgetTransactionPayee> => {
  // Create equivalent payee for transfers
  const payee = await createAndPostPayee({
    userId: model.userId,
    name: `TRANSFER: ${model.name}`,
    transferAccountId: model.id,
    transferAccountName: model.name,
  });

  await updateAccount(model, {
    transferPayeeId: payee.id,
    transferPayeeName: payee.name,
  });

  return payee;
};

export const postAccount = async (
  model: BudgetAccount
): Promise<BudgetAccount> => {
  await postModelToCollection(
    model,
    model.userId.collection(CollectionTypes.ACCOUNTS)
  );

  await createMatchingPayee(model);

  return model;
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

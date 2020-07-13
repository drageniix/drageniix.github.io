import {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../middleware/persistence";
import BudgetTransactionPayee, {
  BudgetPayeeInternalProperties,
} from "../models/Payee";
import { getAccount, updateAccount } from "./account";

export const createPayee = (parameters: {
  explicit?: any; //eslint-disable-line
  snapshot?: DocumentSnapshot;
}): BudgetTransactionPayee => new BudgetTransactionPayee(parameters);

const updatePayeeName = async (
  model: BudgetTransactionPayee,
  name: string
): Promise<void> => {
  model.name = name;

  if (model.transferAccountId) {
    await getAccount(model.userId, {
      accountRef: model.transferAccountId,
    }).then((account) =>
      updateAccount(account, { transferPayeeName: model.name })
    );
  }

  //   await BudgetTransaction.getAllTransactions(model.userId, {
  //     payee: model,
  //   }).then((transactions) =>
  //     Promise.all(
  //       transactions.map((transaction) => {
  //         transaction.setLinkedValues({
  //           payeeName: model.name,
  //         });
  //         return transaction.update();
  //       })
  //     )
  //   );
};

export const updatePayee = async (
  model: BudgetTransactionPayee,
  {
    name,
    transferAccountName,
    transferAccountId,
  }: {
    name?: string;
    transferAccountName?: string;
    transferAccountId?: DocumentReference;
  } = {}
): Promise<BudgetTransactionPayee> => {
  name && (await updatePayeeName(model, name));
  model.transferAccountName = transferAccountName || model.transferAccountName;
  model.transferAccountId = transferAccountId || model.transferAccountId;
  await updateModel(model);
  return model;
};

export const postPayee = async (
  model: BudgetTransactionPayee
): Promise<BudgetTransactionPayee> => {
  await postModelToCollection(
    model,
    model.userId.collection(CollectionTypes.PAYEES)
  );
  return model;
};

export const createAndPostPayee = (
  explicit: BudgetPayeeInternalProperties
): Promise<BudgetTransactionPayee> => postPayee(createPayee({ explicit }));

export const getPayee = async (
  userRef: DocumentReference,
  {
    payeeRef,
    plaidPayeeId,
  }: {
    payeeRef?: documentReferenceType;
    plaidPayeeId?: string;
  }
): Promise<BudgetTransactionPayee> => {
  if (plaidPayeeId) {
    return userRef
      .collection(CollectionTypes.PAYEES)
      .where("plaidPayeeId", "==", plaidPayeeId)
      .get()
      .then(
        (Payees) =>
          Payees.docs.length === 1 &&
          createPayee({
            snapshot: Payees.docs[0],
          })
      );
  } else if (payeeRef) {
    return getDocumentReference(userRef, payeeRef, CollectionTypes.PAYEES)
      .get()
      .then((Payee) => Payee && createPayee({ snapshot: Payee }));
  } else return null;
};

export const getAllPayees = async (
  userRef: DocumentReference
): Promise<BudgetTransactionPayee[]> => {
  return userRef
    .collection(CollectionTypes.PAYEES)
    .get()
    .then((payees) => payees.docs.map((snapshot) => createPayee({ snapshot })));
};

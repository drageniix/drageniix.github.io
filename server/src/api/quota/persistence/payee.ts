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

export const createPayee = (parameters: {
  explicit?: BudgetPayeeInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetTransactionPayee => new BudgetTransactionPayee(parameters);

export const updatePayee = async (
  payee: BudgetTransactionPayee,
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
  payee.name = name || payee.name;
  payee.transferAccountName = transferAccountName || payee.transferAccountName;
  payee.transferAccountId = transferAccountId || payee.transferAccountId;
  await updateModel(payee);
  return payee;
};

export const postPayee = async (
  payee: BudgetTransactionPayee
): Promise<BudgetTransactionPayee> => {
  await postModelToCollection(
    payee,
    payee.userId.collection(CollectionTypes.PAYEES)
  );
  return payee;
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

export const getPayeeReferenceById = (
  userRef: DocumentReference,
  payee: documentReferenceType
): DocumentReference => {
  return getDocumentReference(userRef, payee, CollectionTypes.PAYEES);
};

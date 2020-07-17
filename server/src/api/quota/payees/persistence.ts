import { BudgetPayee, BudgetPayeeInternalProperties } from ".";
import {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../gateway/persistence";

export const createPayee = (parameters: {
  explicit?: BudgetPayeeInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetPayee => new BudgetPayee(parameters);

export const updatePayee = async (
  payee: BudgetPayee,
  {
    name,
    note,
    transferAccountName,
    transferAccountId,
  }: {
    name?: string;
    note?: string;
    transferAccountName?: string;
    transferAccountId?: DocumentReference;
  } = {}
): Promise<BudgetPayee> => {
  payee.name = name || payee.name;
  payee.note = note || payee.note;
  payee.transferAccountName = transferAccountName || payee.transferAccountName;
  payee.transferAccountId = transferAccountId || payee.transferAccountId;
  await updateModel(payee);
  return payee;
};

export const postPayee = async (payee: BudgetPayee): Promise<BudgetPayee> => {
  await postModelToCollection(
    payee,
    payee.userId.collection(CollectionTypes.PAYEES)
  );
  return payee;
};

export const createAndPostPayee = (
  explicit: BudgetPayeeInternalProperties
): Promise<BudgetPayee> => postPayee(createPayee({ explicit }));

export const getPayeeReferenceById = (
  userRef: DocumentReference,
  payee: documentReferenceType
): DocumentReference =>
  getDocumentReference(userRef, payee, CollectionTypes.PAYEES);

export const getPayee = async (
  userRef: DocumentReference,
  {
    payeeId,
    plaidPayeeId,
  }: {
    payeeId?: documentReferenceType;
    plaidPayeeId?: string;
  }
): Promise<BudgetPayee> => {
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
  } else if (payeeId) {
    return getPayeeReferenceById(userRef, payeeId)
      .get()
      .then((Payee) => Payee && createPayee({ snapshot: Payee }));
  } else return null;
};

export const getAllPayees = async (
  userRef: DocumentReference
): Promise<BudgetPayee[]> =>
  userRef
    .collection(CollectionTypes.PAYEES)
    .get()
    .then((payees) => payees.docs.map((snapshot) => createPayee({ snapshot })));

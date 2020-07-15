import { BudgetAccount, BudgetAccountInternalProperties } from ".";
import {
  CollectionTypes,
  DocumentReference,
  documentReferenceType,
  DocumentSnapshot,
  getDocumentReference,
  postModelToCollection,
  updateModel,
} from "../../gateway/persistence";
import { getInstitutionReferenceById } from "../institution";

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

export const createAccount = (parameters: {
  explicit?: BudgetAccountInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetAccount => new BudgetAccount(parameters);

export const postAccount = async (
  account: BudgetAccount
): Promise<BudgetAccount> => {
  const collectionRef = account.userId.collection(CollectionTypes.ACCOUNTS);
  if (account.plaidAccountId) {
    const existing = await collectionRef
      .where("plaidAccountId", "==", account.plaidAccountId)
      .get();
    if (existing.docs.length === 0) {
      await postModelToCollection(account, collectionRef);
    }
  } else {
    await postModelToCollection(account, collectionRef);
  }
  return account;
};

export const postAccounts = async (
  accounts: BudgetAccount[]
): Promise<BudgetAccount[]> =>
  Promise.all(accounts.map((account) => postAccount(account)));

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
    return getAccountReferenceById(userRef, accountRef)
      .get()
      .then((snapshot) => snapshot && createAccount({ snapshot }));
  } else return null;
};

export const getAllAccounts = async (
  userRef: DocumentReference,
  {
    institutionRef,
  }: {
    institutionRef?: documentReferenceType;
  } = {}
): Promise<BudgetAccount[]> => {
  let query = userRef
    .collection(CollectionTypes.ACCOUNTS)
    .where("hidden", "==", false);

  if (institutionRef) {
    const institutionId = getInstitutionReferenceById(userRef, institutionRef);
    query = query.where("institutionId", "==", institutionId.id);
  }

  return query
    .get()
    .then((categories) =>
      categories.docs.map((snapshot) => createAccount({ snapshot }))
    );
};

export const getAccountReferenceById = (
  userRef: DocumentReference,
  account: documentReferenceType
): DocumentReference =>
  getDocumentReference(userRef, account, CollectionTypes.ACCOUNTS);

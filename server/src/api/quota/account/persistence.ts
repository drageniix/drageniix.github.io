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
    availableBalance,
    currentBalance,
    note,
  }: {
    name?: string;
    note?: string;
    availableBalance?: number;
    currentBalance?: number;
    transferPayeeName?: string;
    transferPayeeId?: DocumentReference;
  } = {}
): Promise<BudgetAccount> => {
  account.name = name || account.name;
  account.note = note || account.note;
  account.availableBalance = availableBalance || account.availableBalance;
  account.currentBalance = currentBalance || account.currentBalance;
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

export const getAccountReferenceById = (
  userRef: DocumentReference,
  account: documentReferenceType
): DocumentReference =>
  getDocumentReference(userRef, account, CollectionTypes.ACCOUNTS);

export const getAccount = async (
  userRef: DocumentReference,
  {
    accountId,
    plaidAccountId,
  }: {
    accountId?: documentReferenceType;
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
  } else if (accountId) {
    return getAccountReferenceById(userRef, accountId)
      .get()
      .then((snapshot) => snapshot && createAccount({ snapshot }));
  } else return null;
};

export const getAllAccounts = async (
  userRef: DocumentReference,
  {
    institutionId,
  }: {
    institutionId?: documentReferenceType;
  } = {}
): Promise<BudgetAccount[]> => {
  let query = userRef
    .collection(CollectionTypes.ACCOUNTS)
    .where("hidden", "==", false);

  if (institutionId) {
    const institution = getInstitutionReferenceById(userRef, institutionId);
    query = query.where("institutionId", "==", institution.id);
  }

  return query
    .get()
    .then((categories) =>
      categories.docs.map((snapshot) => createAccount({ snapshot }))
    );
};

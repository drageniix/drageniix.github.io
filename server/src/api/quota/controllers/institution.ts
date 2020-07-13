import { firestore } from "firebase-admin";
import { Account } from "plaid";
import {
  CollectionTypes,
  DocumentSnapshot,
  postModelToCollection,
} from "../middleware/persistence";
import BudgetAccount from "../models/Account";
import BudgetInstitution, {
  BudgetInstitutionInternalProperties,
} from "../models/Instituition";
import { createAccount } from "./account";

export const createInstitution = (parameters: {
  explicit?: BudgetInstitutionInternalProperties;
  snapshot?: DocumentSnapshot;
}): BudgetInstitution => new BudgetInstitution(parameters);

export const postInstitution = async (
  model: BudgetInstitution
): Promise<BudgetInstitution> => {
  await postModelToCollection(
    model,
    model.userId.collection(CollectionTypes.CATEGORIES)
  );
  return model;
};

export const createAndPostInstitution = async (
  explicit: BudgetInstitutionInternalProperties
): Promise<BudgetInstitution> =>
  postInstitution(createInstitution({ explicit }));

export const createAccountsFromInstitution = async (
  model: BudgetInstitution,
  {
    accounts,
  }: {
    accounts: Account[];
  }
): Promise<BudgetAccount[]> => {
  return Promise.all(
    accounts.map((account) =>
      createAccount({
        explicit: {
          userId: model.userId,
          institutionId: model.id,
          name: account.name,
          originalName: account.official_name,
          availableBalance: account.balances.available,
          currentBalance: account.balances.current,
          startingBalance: account.balances.current,
          type: account.type,
          subtype: account.subtype,
          plaidAccountId: account.account_id,
        },
      })
    )
  );
};

export const getAllInstitutions = async (
  userRef: firestore.DocumentReference
): Promise<BudgetInstitution[]> => {
  const query = userRef
    .collection(CollectionTypes.INSTITUTION)
    .where("active", "==", true);

  return query
    .get()
    .then((institutions) =>
      institutions.docs.map((snapshot) => createInstitution({ snapshot }))
    );
};

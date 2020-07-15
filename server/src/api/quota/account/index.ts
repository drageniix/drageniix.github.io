import * as BudgetAccountBusiness from "./business";
import BudgetAccount, { BudgetAccountInternalProperties } from "./model";
import * as BudgetAccountPersistence from "./persistence";
import BudgetAccountRoutes from "./routes";

const {
  createAccount,
  createAndPostAccount,
  getAccount,
  getAccountReferenceById,
  getAllAccounts,
  postAccount,
  postAccounts,
  updateAccount,
} = BudgetAccountPersistence;

const {
  createAccountsFromInstitution,
  createMatchingPayee,
  updateLinkedAccountName,
} = BudgetAccountBusiness;

export {
  BudgetAccountRoutes,
  BudgetAccount,
  BudgetAccountInternalProperties,
  createAccountsFromInstitution,
  createMatchingPayee,
  updateLinkedAccountName,
  createAccount,
  createAndPostAccount,
  getAccount,
  getAccountReferenceById,
  getAllAccounts,
  postAccount,
  postAccounts,
  updateAccount,
};

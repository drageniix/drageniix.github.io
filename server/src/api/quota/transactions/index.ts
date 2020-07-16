import * as BudgetTransactionBusiness from "./business";
import BudgetTransaction, {
  BudgetTransactionInternalProperties,
} from "./model";
import * as BudgetTransactionPersistence from "./persistence";
import BudgetTransactionRouter from "./routes";

const {
  convertPlaidTransactions: importTransactions,
  addManualTransaction,
  importTransactionsFromInstitution: getPlaidTransactionsFromInstitution,
} = BudgetTransactionBusiness;

const {
  createAndPostTransaction,
  createTransaction,
  getAllTransactions,
  getTransaction,
  postTransaction,
  updateTransaction,
  postTransactions,
  getTransactionReferenceById,
} = BudgetTransactionPersistence;

export {
  BudgetTransactionRouter,
  BudgetTransaction,
  BudgetTransactionInternalProperties,
  addManualTransaction,
  importTransactions,
  getPlaidTransactionsFromInstitution,
  createAndPostTransaction,
  createTransaction,
  getAllTransactions,
  getTransaction,
  postTransaction,
  updateTransaction,
  postTransactions,
  getTransactionReferenceById,
};

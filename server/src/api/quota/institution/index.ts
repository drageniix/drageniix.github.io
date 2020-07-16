import * as BudgetInstitutionBuiness from "./business";
import BudgetInstitution, {
  BudgetInstitutionInternalProperties,
} from "./model";
import * as BudgetInstitutionPersistence from "./persistence";
import BudgetInstitutionRoutes from "./routes";

const { importPlaidTransactionsFromInstitution } = BudgetInstitutionBuiness;

const {
  createInstitution,
  createAndPostInstitution,
  getAllInstitutions,
  getInstitutionReferenceById,
  postInstitution,
  getInstitution,
  updateInstitution,
} = BudgetInstitutionPersistence;

export {
  BudgetInstitutionRoutes,
  BudgetInstitution,
  BudgetInstitutionInternalProperties,
  importPlaidTransactionsFromInstitution,
  createInstitution,
  createAndPostInstitution,
  getAllInstitutions,
  getInstitutionReferenceById,
  postInstitution,
  getInstitution,
  updateInstitution,
};

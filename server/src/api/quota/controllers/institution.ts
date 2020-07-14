import { BudgetInstitution } from "../models";
import { BudgetInstitutionPersistence } from "../persistence";

const {
  createInstitution,
  createAndPostInstitution,
  getAllInstitutions,
  getInstitutionReferenceById,
  postInstitution,
} = BudgetInstitutionPersistence;

export {
  BudgetInstitution,
  createInstitution,
  createAndPostInstitution,
  getAllInstitutions,
  getInstitutionReferenceById,
  postInstitution,
};

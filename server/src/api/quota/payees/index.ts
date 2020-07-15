import * as BudgetPayeeBusiness from "./business";
import BudgetPayee, { BudgetPayeeInternalProperties } from "./model";
import * as BudgetPayeePersistence from "./persistence";
import BudgetPayeeRouter from "./routes";

const { updateLinkedPayeeName } = BudgetPayeeBusiness;
const {
  createPayee,
  createAndPostPayee,
  getAllPayees,
  postPayee,
  getPayee,
  updatePayee,
  getPayeeReferenceById,
} = BudgetPayeePersistence;

export {
  BudgetPayeeRouter,
  BudgetPayee,
  BudgetPayeeInternalProperties,
  updateLinkedPayeeName,
  createPayee,
  createAndPostPayee,
  getAllPayees,
  getPayee,
  updatePayee,
  postPayee,
  getPayeeReferenceById,
};

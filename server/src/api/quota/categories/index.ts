import * as BudgetCategoryBusiness from "./business";
import BudgetCategory, { BudgetCategoryInternalProperties } from "./model";
import * as BudgetCategoryPersistence from "./persistence";
import BudgetCategoryRoutes from "./routes";

const {
  createDefaultCategories,
  updateLinkedCategoryName,
} = BudgetCategoryBusiness;

const {
  createCategory,
  createAndPostCategory,
  getCategory,
  getCategoryReferenceById,
  getAllCategories,
  postCategory,
  postCategories,
  updateCategory,
  deleteCategories,
} = BudgetCategoryPersistence;

export {
  BudgetCategoryRoutes,
  BudgetCategory,
  BudgetCategoryInternalProperties,
  createDefaultCategories,
  deleteCategories,
  updateLinkedCategoryName,
  createCategory,
  createAndPostCategory,
  getCategory,
  getCategoryReferenceById,
  getAllCategories,
  postCategory,
  postCategories,
  updateCategory,
};

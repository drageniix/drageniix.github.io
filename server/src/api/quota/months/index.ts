import BudgetMonth, { BudgetMonthInternalProperties } from "./model";
import * as BudgetMonthPersistence from "./persistence";
import BudgetMonthRouter from "./routes";

const {
  createMonth,
  createAndPostMonth,
  getAllMonths,
  postMonth,
  getMonth,
  updateMonth,
} = BudgetMonthPersistence;

export {
  BudgetMonthRouter,
  BudgetMonthInternalProperties,
  BudgetMonth,
  createMonth,
  createAndPostMonth,
  getAllMonths,
  getMonth,
  updateMonth,
  postMonth,
};

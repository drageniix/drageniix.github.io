import { BudgetMonth } from "../models";
import { BudgetMonthPersistence } from "../persistence";

const {
  createMonth,
  createAndPostMonth,
  getAllMonths,
  postMonth,
  getMonth,
  updateMonth,
} = BudgetMonthPersistence;

export {
  BudgetMonth,
  createMonth,
  createAndPostMonth,
  getAllMonths,
  getMonth,
  updateMonth,
  postMonth,
};

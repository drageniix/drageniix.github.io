import express from "express";
import { BudgetAccountRoutes } from "./account";
import { BudgetCategoryRoutes } from "./categories";
import { BudgetInstitutionRoutes } from "./institution";
import { BudgetMonthRouter } from "./months";
import { BudgetPayeeRouter } from "./payees";
import { BudgetTransactionRouter } from "./transactions";
import { BudgetUserRoutes } from "./user";

const router = express.Router();

router.use("/account", BudgetAccountRoutes);

router.use("/payee", BudgetPayeeRouter);

router.use("/category", BudgetCategoryRoutes);

router.use("/months", BudgetMonthRouter);

router.use("/transaction", BudgetTransactionRouter);

router.use("/user", BudgetUserRoutes);

router.use("/institution", BudgetInstitutionRoutes);

export default router;

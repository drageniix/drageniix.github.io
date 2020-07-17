import express from "express";
import { BudgetAccountRoutes } from "./account";
import { BudgetCategoryRoutes } from "./categories";
import { BudgetInstitutionRoutes } from "./institution";
import { BudgetPayeeRouter } from "./payees";
import { BudgetScheduledRouter } from "./scheduled";
import { BudgetTransactionRouter } from "./transactions";
import { BudgetUserRouter } from "./user";

const router = express.Router();

router.use("/account", BudgetAccountRoutes);

router.use("/payee", BudgetPayeeRouter);

router.use("/category", BudgetCategoryRoutes);

router.use("/transaction", BudgetTransactionRouter);

router.use("/scheduled", BudgetScheduledRouter);

router.use("/user", BudgetUserRouter);

router.use("/institution", BudgetInstitutionRoutes);

export default router;

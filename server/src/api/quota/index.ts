import express from "express";
import { router as BudgetAccountRoutes } from "./account";
import { router as BudgetSuggestedRouter } from "./budget";
import { router as BudgetCategoryRoutes } from "./categories";
import { router as BudgetInstitutionRoutes } from "./institution";
import { router as BudgetPayeeRouter } from "./payees";
import { router as BudgetScheduledRouter } from "./scheduled";
import { router as BudgetTransactionRouter } from "./transactions";
import { router as BudgetUserRouter } from "./user";

const router = express.Router();

router.use("/account", BudgetAccountRoutes);

router.use("/payee", BudgetPayeeRouter);

router.use("/category", BudgetCategoryRoutes);

router.use("/transaction", BudgetTransactionRouter);

router.use("/scheduled", BudgetScheduledRouter);

router.use("/user", BudgetUserRouter);

router.use("/institution", BudgetInstitutionRoutes);

router.use("/budget", BudgetSuggestedRouter);

export default router;

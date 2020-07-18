"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_1 = require("./account");
const categories_1 = require("./categories");
const institution_1 = require("./institution");
const payees_1 = require("./payees");
const scheduled_1 = require("./scheduled");
const transactions_1 = require("./transactions");
const user_1 = require("./user");
const router = express_1.default.Router();
router.use("/account", account_1.BudgetAccountRoutes);
router.use("/payee", payees_1.BudgetPayeeRouter);
router.use("/category", categories_1.BudgetCategoryRoutes);
router.use("/transaction", transactions_1.BudgetTransactionRouter);
router.use("/scheduled", scheduled_1.BudgetScheduledRouter);
router.use("/user", user_1.BudgetUserRouter);
router.use("/institution", institution_1.BudgetInstitutionRoutes);
exports.default = router;

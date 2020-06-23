"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatesFromQueryParameters = exports.getFutureBudget = exports.getScheduledTransactions = exports.getTransactions = exports.getCategories = exports.getPayees = exports.getAccounts = exports.getRaw = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const paycheck_1 = require("./paycheck");
const scheduled_1 = require("./scheduled");
const budget = fs_extra_1.default.readJSONSync("./src/res/budget.json");
exports.getRaw = (req, res, next) => res.status(200).json(budget);
exports.getAccounts = (req, res, next) => res.status(200).json(budget.accounts);
exports.getPayees = (req, res, next) => res.status(200).json(budget.payees);
exports.getCategories = (req, res, next) => res.status(200).json(budget.categories);
exports.getTransactions = (req, res, next) => res.status(200).json(budget.transactions);
exports.getScheduledTransactions = (req, res, next) => {
    const { scheduledUntil } = exports.getDatesFromQueryParameters(req.query);
    return res
        .status(200)
        .json(scheduled_1.planScheduledTransactions(budget.scheduledTransactions, scheduledUntil));
};
exports.getFutureBudget = (req, res, next) => {
    const { scheduledUntil, transactionsSince } = exports.getDatesFromQueryParameters(req.query);
    return res.status(200).json(paycheck_1.generateFutureBudgetMap({
        categories: budget.categories,
        scheduledTransactions: budget.scheduledTransactions,
        scheduledUntil,
        transactionsSince,
        shouldCountPaychecks: true,
    }));
};
exports.getDatesFromQueryParameters = (query) => {
    const scheduledUntil = (query &&
        query.scheduledUntil &&
        typeof query.scheduledUntil === "string" &&
        new Date(query.scheduledUntil)) ||
        new Date();
    const transactionsSince = (query &&
        query.transactionsSince &&
        typeof query.transactionsSince === "string" &&
        new Date(query.transactionsSince)) ||
        new Date();
    return { scheduledUntil, transactionsSince };
};

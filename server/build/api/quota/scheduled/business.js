"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFutureScheduledTransactions = exports.addDates = exports.frequencyMap = exports.addManualScheduledTransaction = void 0;
const _1 = require(".");
const BudgetAccountController = __importStar(require("../account"));
const BudgetCategoryController = __importStar(require("../categories"));
const BudgetPayeeController = __importStar(require("../payees"));
exports.addManualScheduledTransaction = (userRef, { accountId, payeeId, categoryId, amount, date, note, flagColor, frequency, }) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield BudgetAccountController.getAccount(userRef, {
        accountId: accountId,
    });
    const payee = yield BudgetPayeeController.getPayee(userRef, {
        payeeId: payeeId,
    });
    const category = yield BudgetCategoryController.getCategory(userRef, {
        categoryId: categoryId,
    });
    return _1.createScheduled({
        explicit: {
            accountId: account.id,
            accountName: account.name,
            amount: amount,
            note: note,
            date: new Date(date),
            payeeId: payee.id,
            payeeName: payee.name,
            userId: userRef,
            categoryId: category.id,
            categoryName: category.name,
            frequency,
            flagColor,
        },
    });
});
exports.frequencyMap = {
    weekly: 7,
    everyOtherWeek: 14,
    everyOtherMonth: 2,
    monthly: 1,
    yearly: 1,
    twiceAYear: 6,
};
exports.addDates = (frequency, date) => {
    const newDate = new Date(date);
    switch (frequency) {
        case "yearly":
            newDate.setFullYear(newDate.getFullYear() + exports.frequencyMap[frequency]);
            break;
        case "monthly":
        case "twiceAYear":
        case "everyOtherMonth":
            newDate.setMonth(newDate.getMonth() + exports.frequencyMap[frequency]);
            break;
        case "weekly":
        case "everyOtherWeek":
        default:
            newDate.setDate(newDate.getDate() + exports.frequencyMap[frequency]);
            break;
    }
    return newDate;
};
exports.createFutureScheduledTransactions = (userRef, scheduledUntil) => _1.getAllScheduleds(userRef, { scheduledUntil }).then((scheduleds) => {
    const dateMappedScheduledTransactions = [];
    scheduleds.forEach((scheduledTransaction) => {
        if (scheduledTransaction.frequency &&
            !!exports.frequencyMap[scheduledTransaction.frequency]) {
            let date = exports.addDates(scheduledTransaction.frequency, scheduledTransaction.date);
            // add days to transaction date until out of scope
            while (date < scheduledUntil) {
                const newTransaction = _1.createScheduled({
                    explicit: Object.assign(Object.assign({}, scheduledTransaction), { date }),
                });
                dateMappedScheduledTransactions.push(newTransaction);
                date = exports.addDates(scheduledTransaction.frequency, date);
            }
        }
    });
    return dateMappedScheduledTransactions.sort((t1, t2) => t1.date.getTime() - t2.date.getTime());
});

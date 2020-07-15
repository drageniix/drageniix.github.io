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
exports.importTransactions = void 0;
const _1 = require(".");
const BudgetAccountController = __importStar(require("../account"));
const BudgetCategoryController = __importStar(require("../categories"));
const BudgetPayeeController = __importStar(require("../payees"));
exports.importTransactions = (userRef, transactions) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(transactions.map((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield BudgetAccountController.getAccount(userRef, {
            plaidAccountId: transaction.account_id,
        });
        const existingPayee = yield BudgetPayeeController.getPayee(userRef, {
            plaidPayeeId: transaction.name,
        });
        const category = yield BudgetCategoryController.getCategory(userRef, {
            categoryRef: existingPayee && existingPayee.defaultCategoryId,
            plaidCategoryId: transaction.category_id,
        });
        const payee = existingPayee ||
            (yield BudgetPayeeController.createAndPostPayee({
                name: transaction.name,
                originalName: transaction.name,
                userId: userRef,
                defaultCategoryId: category.id,
            }));
        return _1.createTransaction({
            explicit: {
                accountId: account.id,
                accountName: account.name,
                amount: transaction.amount,
                cleared: !transaction.pending,
                date: new Date(transaction.date),
                payeeId: payee.id,
                payeeName: payee.name,
                userId: userRef,
                categoryId: category.id,
                categoryName: category.name,
            },
        });
    })));
});
// async updateAccountAmount(amount: number): Promise<BudgetTransaction> {
//   const account = await BudgetAccount.getAccount(this.userId, {
//     accountRef: this.accountId,
//   });
//   account.currentBalance += amount;
//   account.availableBalance += amount;
//   await account.update();
//   this.accountId = account.id;
//   this.accountName = account.name;
//   return this.update();
// }
// async updateDate(newDate: Date): Promise<BudgetTransaction> {
//   await this.updateCategoryAmount(-this.amount);
//   this.date = newDate;
//   await this.updateCategoryAmount(this.amount);
//   return this.update();
// }
// async updatePayee(
//   payeeId: documentReferenceType
// ): Promise<BudgetTransaction> {
//   const payee = await BudgetTransactionPayee.getPayee(this.userId, {
//     payeeRef: payeeId,
//   });
//   this.payeeId = payee.id;
//   this.payeeName = payee.name;
//   return this.update();
// }

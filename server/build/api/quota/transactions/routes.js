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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BudgetTransactionController = __importStar(require("."));
const express_2 = require("../../../middleware/express");
const plaid_1 = require("../../gateway/plaid");
const BudgetInstitutionController = __importStar(require("../institution"));
const common_1 = require("../validations/common");
const router = express_1.default.Router({ mergeParams: true });
router.get("/", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetTransactionController.getAllTransactions(req.userId, {
    accountRef: req.query.accountId,
    payeeRef: req.query.payeeId,
    categoryRef: req.query.categoryId,
}).then((transactions) => res.status(200).json({
    transactions: transactions.map((transaction) => transaction.getDisplayFormat()),
}))));
router.post("/", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetTransactionController.createAndPostTransaction(Object.assign(Object.assign({}, req.body), { userId: req.userId })).then((transaction) => res.status(200).json(transaction.getDisplayFormat()))));
router.get("/:transactionId", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetTransactionController.getTransaction(req.userId, req.params.transactionId).then((transaction) => res.status(200).json(transaction.getDisplayFormat()))));
router.put("/:transactionId", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetTransactionController.getTransaction(req.userId, req.params.transactionId)
    .then((transaction) => BudgetTransactionController.updateTransaction(transaction, {
    amount: req.body.amount,
    date: req.body.date,
}))
    .then((transaction) => res.status(200).json(transaction.getDisplayFormat()))));
router.get("/import", common_1.isAuth, express_2.asyncWrapper((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return BudgetInstitutionController.getAllInstitutions(req.userId)
        .then((institutions) => Promise.all(institutions.map((institution) => __awaiter(void 0, void 0, void 0, function* () {
        const startDate = req.query.start ||
            institution.updatedAt.toISOString().slice(0, 10), endDate = req.query.end ||
            new Date().toISOString().slice(0, 10);
        const { transactions } = yield plaid_1.getPlaidTransactions(institution.plaidAccessToken, startDate, endDate);
        yield BudgetInstitutionController.setUpdatedAt(institution, endDate);
        return transactions;
    }))))
        .then((transactionList) => BudgetTransactionController.importTransactions(req.userId, [].concat(...transactionList)))
        .then((transactions) => BudgetTransactionController.postTransactions(transactions))
        .then((transactions) => res
        .status(200)
        .json(transactions.map((transaction) => transaction.getDisplayFormat())));
})));
exports.default = router;

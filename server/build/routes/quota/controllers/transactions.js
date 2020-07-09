"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putTransaction = exports.getTransaction = exports.postTransaction = exports.getTransactions = void 0;
const Transaction_1 = __importDefault(require("../models/Transaction"));
exports.getTransactions = (req, res) => Transaction_1.default.getAllTransactions(req.userId).then((transactions) => res
    .status(200)
    .json(transactions.map((transaction) => transaction.getFormattedResponse())));
exports.postTransaction = (req, res) => new Transaction_1.default({ explicit: Object.assign(Object.assign({}, req.body), { userId: req.userId }) })
    .post()
    .then((transaction) => res.status(200).json(transaction.getFormattedResponse()));
exports.getTransaction = (req, res) => Transaction_1.default.getTransaction(req.userId, req.params.transactionId).then((transaction) => res.status(200).json(transaction.getFormattedResponse()));
exports.putTransaction = (req, res) => Transaction_1.default.getTransaction(req.userId, req.params.transactionId)
    .then((transaction) => transaction.updateTransaction({
    amount: req.body.amount,
    date: req.body.date,
    payee: req.body.payeeId,
}))
    .then((transaction) => res.status(200).json(transaction.getFormattedResponse()));

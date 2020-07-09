"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putAccount = exports.getAccount = exports.postAccount = exports.getAccounts = void 0;
const Account_1 = __importDefault(require("../models/Account"));
exports.getAccounts = (req, res) => Account_1.default.getAllAccounts(req.userId).then((accounts) => res
    .status(200)
    .json(accounts.map((account) => account.getFormattedResponse())));
exports.postAccount = (req, res) => new Account_1.default({ explicit: Object.assign(Object.assign({}, req.body), { userId: req.userId }) })
    .post()
    .then((account) => res.status(200).json(account.getFormattedResponse()));
exports.getAccount = (req, res) => Account_1.default.getAccount(req.userId, {
    accountRef: req.params.accountId,
}).then((account) => res.status(200).json(account.getFormattedResponse()));
exports.putAccount = (req, res) => Account_1.default.getAccount(req.userId, { accountRef: req.params.accountId })
    .then((account) => account.updateAccount({ name: req.body.name }))
    .then((account) => res.status(200).json(account.getFormattedResponse()));

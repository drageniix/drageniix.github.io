"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putPayee = exports.getPayee = exports.postPayee = exports.getPayees = void 0;
const Payee_1 = __importDefault(require("../models/Payee"));
exports.getPayees = (req, res) => Payee_1.default.getAllPayees(req.userId).then((payees) => res.status(200).json(payees.map((payee) => payee.getFormattedResponse())));
exports.postPayee = (req, res) => new Payee_1.default({ explicit: Object.assign(Object.assign({}, req.body), { userId: req.userId }) })
    .post()
    .then((payee) => res.status(200).json(payee.getFormattedResponse()));
exports.getPayee = (req, res) => Payee_1.default.getPayee(req.userId, {
    payeeRef: req.params.payeeId,
}).then((payee) => res.status(200).json(payee.getFormattedResponse()));
exports.putPayee = (req, res) => Payee_1.default.getPayee(req.userId, { payeeRef: req.params.payeeId })
    .then((payee) => payee.updatePayee({ name: req.body.name }))
    .then((payee) => res.status(200).json(payee.getFormattedResponse()));

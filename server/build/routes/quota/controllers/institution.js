"use strict";
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
exports.importTransactions = exports.createInstituition = void 0;
const plaid_1 = require("../middleware/plaid");
const Instituition_1 = __importDefault(require("../models/Instituition"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
exports.createInstituition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { item_id, access_token, institution_name, accounts, } = yield plaid_1.exchangePlaidPublicTokenForItem(req.body.token);
    const institution = yield new Instituition_1.default({
        explicit: {
            name: institution_name,
            plaidItemId: item_id,
            plaidAccessToken: access_token,
            userId: req.userId,
        },
    }).post({ accounts });
    return res.status(200).json(institution.getFormattedResponse());
});
exports.importTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionImportResult = yield yield Instituition_1.default.getAllInstitutions(req.userId)
        .then((institutions) => Promise.all(institutions.map((institution) => plaid_1.getPlaidTransactions(institution.plaidAccessToken, institution.updatedAt.toISOString().slice(0, 10)))))
        .then((transactions) => [].concat(...transactions.map((transactionList) => transactionList.transactions)))
        .then((transactions) => Transaction_1.default.importTransactions(req.userId, transactions));
    return res.status(200).json({ result: transactionImportResult.length });
});

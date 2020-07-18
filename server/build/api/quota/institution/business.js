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
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPlaidTransactionsFromInstitution = void 0;
const _1 = require(".");
const plaid_1 = require("../gateway/plaid");
exports.importPlaidTransactionsFromInstitution = (institution, { startDate, endDate }) => __awaiter(void 0, void 0, void 0, function* () {
    const adjustedStartDate = startDate || institution.updatedAt.toISOString().slice(0, 10);
    const adjustedEndDate = endDate || new Date().toISOString().slice(0, 10);
    const { transactions } = yield plaid_1.getPlaidTransactions(institution.plaidAccessToken, adjustedStartDate, adjustedEndDate);
    yield _1.updateInstitution(institution, {
        updatedAt: new Date(adjustedEndDate),
    });
    return transactions;
});

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
exports.exchangePlaidPublicTokenForItem = exports.getPlaidInstitution = exports.getPlaidAccounts = exports.getPlaidTransactions = exports.getPlaidCategories = exports.exchangePlaidPublicToken = void 0;
const plaid_1 = __importDefault(require("../../../middleware/plaid"));
exports.exchangePlaidPublicToken = (publicToken) => plaid_1.default.getPlaidClient().exchangePublicToken(publicToken);
exports.getPlaidCategories = () => plaid_1.default.getPlaidClient().getCategories();
exports.getPlaidTransactions = (accessToken, startDate, endDate = new Date().toISOString().slice(0, 10)) => plaid_1.default.getPlaidClient().getTransactions(accessToken, startDate, endDate);
exports.getPlaidAccounts = (accessToken) => plaid_1.default.getPlaidClient().getAccounts(accessToken);
exports.getPlaidInstitution = (institutionId) => plaid_1.default.getPlaidClient().getInstitutionById(institutionId);
exports.default = plaid_1.default;
exports.exchangePlaidPublicTokenForItem = (publicToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { access_token, item_id } = yield exports.exchangePlaidPublicToken(publicToken);
    const { item: { institution_id }, accounts, } = yield exports.getPlaidAccounts(access_token);
    const { institution: { name: institution_name }, } = yield exports.getPlaidInstitution(institution_id);
    return {
        access_token,
        item_id,
        institution_id,
        institution_name,
        accounts,
    };
});

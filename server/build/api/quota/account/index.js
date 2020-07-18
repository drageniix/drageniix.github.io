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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccount = exports.postAccounts = exports.postAccount = exports.getAllAccounts = exports.getAccountReferenceById = exports.getAccount = exports.createAndPostAccount = exports.createAccount = exports.updateLinkedAccountName = exports.createMatchingPayee = exports.addManualAccount = exports.createAccountsFromInstitution = exports.BudgetAccount = exports.BudgetAccountRoutes = void 0;
const BudgetAccountBusiness = __importStar(require("./business"));
const model_1 = __importDefault(require("./model"));
exports.BudgetAccount = model_1.default;
const BudgetAccountPersistence = __importStar(require("./persistence"));
const routes_1 = __importDefault(require("./routes"));
exports.BudgetAccountRoutes = routes_1.default;
const { createAccount, createAndPostAccount, getAccount, getAccountReferenceById, getAllAccounts, postAccount, postAccounts, updateAccount, } = BudgetAccountPersistence;
exports.createAccount = createAccount;
exports.createAndPostAccount = createAndPostAccount;
exports.getAccount = getAccount;
exports.getAccountReferenceById = getAccountReferenceById;
exports.getAllAccounts = getAllAccounts;
exports.postAccount = postAccount;
exports.postAccounts = postAccounts;
exports.updateAccount = updateAccount;
const { addManualAccount, createAccountsFromInstitution, createAndPostMatchingPayee: createMatchingPayee, updateLinkedAccountName, } = BudgetAccountBusiness;
exports.addManualAccount = addManualAccount;
exports.createAccountsFromInstitution = createAccountsFromInstitution;
exports.createMatchingPayee = createMatchingPayee;
exports.updateLinkedAccountName = updateLinkedAccountName;

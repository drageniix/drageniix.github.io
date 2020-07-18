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
const BudgetAccountController = __importStar(require("."));
const express_2 = require("../gateway/express");
const plaid_1 = require("../gateway/plaid");
const BudgetInstitutionController = __importStar(require("../institution"));
const common_1 = require("../validations/common");
const router = express_1.default.Router({ mergeParams: true });
router.get("/", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetAccountController.getAllAccounts(req.userId, {
    institutionId: req.params.institutionId,
}).then((accounts) => res
    .status(200)
    .json(accounts.map((account) => account.getDisplayFormat())))));
router.post("/", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetAccountController.addManualAccount(req.userId, req.body)
    .then((account) => BudgetAccountController.postAccount(account))
    .then((account) => BudgetAccountController.createMatchingPayee(account))
    .then(({ account }) => res.status(200).json(account.getDisplayFormat()))));
router.post("/default", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetAccountController.createAndPostAccount({
    userId: req.userId,
    institutionId: BudgetInstitutionController.getInstitutionReferenceById(req.userId, req.body.institutionId),
    name: req.query.name || "Cash",
    originalName: "Default Account",
    type: "depository",
    subtype: "checking",
})
    .then((account) => BudgetAccountController.createMatchingPayee(account))
    .then(({ account }) => res.status(200).json(account.getDisplayFormat()))));
router.post("/import", common_1.isAuth, express_2.asyncWrapper((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const institution = yield BudgetInstitutionController.getInstitution(req.userId, req.body.institutionId);
    const { accounts } = yield plaid_1.getPlaidAccounts(institution.plaidAccessToken);
    return BudgetAccountController.createAccountsFromInstitution(institution, accounts.filter((account) => !req.body.accounts ||
        req.body.accounts.includes(account.account_id)))
        .then((accounts) => BudgetAccountController.postAccounts(accounts))
        .then((accounts) => Promise.all(accounts.map((account) => BudgetAccountController.createMatchingPayee(account))))
        .then((pairedAccountAndPayee) => res
        .status(200)
        .json(pairedAccountAndPayee.map(({ account }) => account.getDisplayFormat())));
})));
router.get("/:accountId", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetAccountController.getAccount(req.userId, {
    accountId: req.params.accountId,
}).then((account) => res.status(200).json(account.getDisplayFormat()))));
router.put("/:accountId", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetAccountController.getAccount(req.userId, {
    accountId: req.params.accountId,
})
    .then((account) => req.body.name && req.body.name !== account.name
    ? BudgetAccountController.updateAccount(account, {
        name: req.body.name,
        note: req.body.note,
    }).then((account) => BudgetAccountController.updateLinkedAccountName(account))
    : account)
    .then((account) => res.status(200).json(account.getDisplayFormat()))));
exports.default = router;

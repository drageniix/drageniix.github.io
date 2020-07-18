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
const BudgetInstitutionController = __importStar(require("."));
const express_2 = require("../gateway/express");
const plaid_1 = require("../gateway/plaid");
const common_1 = require("../validations/common");
const router = express_1.default.Router({ mergeParams: true });
// should only be one
router.post("/default", common_1.isAuth, express_2.asyncWrapper((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const institution = yield BudgetInstitutionController.createAndPostInstitution({
        name: req.query.name || "Manual Entry",
        userId: req.userId,
    });
    return res.status(200).json(Object.assign({}, institution.getDisplayFormat()));
})));
router.post("/import", common_1.isAuth, express_2.asyncWrapper((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { access_token: accessToken } = yield plaid_1.exchangePlaidPublicToken(req.body.token);
    const { itemId, institutionName, accounts, } = yield plaid_1.exchangePlaidAccessTokenForItem(accessToken);
    const institution = yield BudgetInstitutionController.createAndPostInstitution({
        name: institutionName,
        plaidItemId: itemId,
        plaidAccessToken: accessToken,
        userId: req.userId,
    });
    return res.status(200).json(Object.assign(Object.assign({}, institution.getDisplayFormat()), { accounts: accounts.map((account) => ({
            accountId: account.account_id,
            name: account.official_name,
            type: account.type,
            subtype: account.subtype,
        })) }));
})));
exports.default = router;

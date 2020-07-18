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
const express_1 = __importDefault(require("express"));
const BudgetPayeeController = __importStar(require("."));
const express_2 = require("../gateway/express");
const common_1 = require("../validations/common");
const router = express_1.default.Router({ mergeParams: true });
router.get("/", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetPayeeController.getAllPayees(req.userId).then((payees) => res.status(200).json(payees.map((payee) => payee.getDisplayFormat())))));
router.post("/", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetPayeeController.createAndPostPayee(Object.assign(Object.assign({}, req.body), { userId: req.userId })).then((payee) => res.status(200).json(payee.getDisplayFormat()))));
router.get("/:payeeId", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetPayeeController.getPayee(req.userId, {
    payeeId: req.params.payeeId,
}).then((payee) => res.status(200).json(payee.getDisplayFormat()))));
router.put("/:payeeId", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetPayeeController.getPayee(req.userId, {
    payeeId: req.params.payeeId,
})
    .then((payee) => req.body.name && req.body.name !== payee.name
    ? BudgetPayeeController.updatePayee(payee, {
        name: req.body.name,
        note: req.body.note,
    }).then((payee) => BudgetPayeeController.updateLinkedPayeeName(payee))
    : payee)
    .then((payee) => res.status(200).json(payee.getDisplayFormat()))));
exports.default = router;

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
const BudgetScheduledController = __importStar(require("."));
const express_2 = require("../gateway/express");
const common_1 = require("../validations/common");
const router = express_1.default.Router({ mergeParams: true });
router.get("/", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetScheduledController.getAllScheduleds(req.userId, {
    accountId: req.query.accountId,
    payeeId: req.query.payeeId,
    categoryId: req.query.categoryId,
    flagColor: req.query.flagColor,
    scheduledUntil: req.query.date && new Date(req.query.date),
}).then((scheduleds) => res.status(200).json({
    scheduleds: scheduleds.map((scheduled) => scheduled.getDisplayFormat()),
}))));
router.post("/", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetScheduledController.addManualScheduledTransaction(req.userId, {
    accountId: req.body.accountId,
    payeeId: req.body.payeeId,
    categoryId: req.body.categoryId,
    amount: req.body.amount,
    date: req.body.date,
    note: req.body.note,
    flagColor: req.body.flagColor,
    frequency: req.body.frequency,
})
    .then((scheduled) => BudgetScheduledController.postScheduled(scheduled))
    .then((scheduled) => res.status(200).json(scheduled.getDisplayFormat()))));
router.get("/:scheduledId", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetScheduledController.getScheduled(req.userId, req.params.scheduledId).then((scheduled) => res.status(200).json(scheduled.getDisplayFormat()))));
router.put("/:scheduledId", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetScheduledController.getScheduled(req.userId, req.params.scheduledId)
    .then((scheduled) => BudgetScheduledController.updateScheduled(scheduled, {
    amount: req.body.amount,
    date: req.body.date,
    note: req.body.note,
    flagColor: req.body.flagColor,
    frequency: req.body.frequency,
}))
    .then((scheduled) => res.status(200).json(scheduled.getDisplayFormat()))));
exports.default = router;

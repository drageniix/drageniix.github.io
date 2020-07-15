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
const BudgetMonthController = __importStar(require("."));
const express_2 = require("../../../middleware/express");
const common_1 = require("../validations/common");
const router = express_1.default.Router({ mergeParams: true });
router.get("/", common_1.isAuth, express_2.asyncWrapper((req, res) => req.query.date
    ? BudgetMonthController.getMonth(req.userId, {
        date: new Date(req.query.date),
    }).then((month) => res.status(200).json(month.getDisplayFormat()))
    : BudgetMonthController.getAllMonths(req.userId).then((months) => res
        .status(200)
        .json(months.map((month) => month.getDisplayFormat())))));
router.get("/:monthId", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetMonthController.getMonth(req.userId, {
    ref: req.params.monthId,
    date: req.params.monthId === "current" && new Date(),
}).then((month) => res.status(200).json(month.getDisplayFormat()))));
exports.default = router;

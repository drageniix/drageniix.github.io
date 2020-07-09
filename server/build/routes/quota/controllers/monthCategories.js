"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putMonthCategory = exports.getMonthCategory = exports.getMonthCategories = void 0;
const MonthCategory_1 = __importDefault(require("../models/MonthCategory"));
exports.getMonthCategories = (req, res) => MonthCategory_1.default.getAllMonthCategories(req.userId, {
    month: req.params.monthId,
}).then((monthCategories) => res
    .status(200)
    .json(monthCategories.map((monthCategory) => monthCategory.getFormattedResponse())));
exports.getMonthCategory = (req, res) => MonthCategory_1.default.getMonthCategory(req.userId, {
    month: req.params.monthId,
    category: req.params.categoryId,
}).then((monthCategory) => res.status(200).json(monthCategory.getFormattedResponse()));
exports.putMonthCategory = (req, res) => MonthCategory_1.default.getMonthCategory(req.userId, {
    month: req.params.monthId,
    category: req.params.categoryId,
})
    .then((monthCategory) => monthCategory.updateMonthCategory({ budget: req.body.budget }))
    .then((monthCategory) => res.status(200).json(monthCategory.getFormattedResponse()));

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonth = exports.postMonth = exports.getMonths = void 0;
const Month_1 = __importDefault(require("../models/Month"));
exports.getMonths = (req, res) => Month_1.default.getAllMonths(req.userId).then((months) => res.status(200).json(months.map((month) => month.getFormattedResponse())));
exports.postMonth = (req, res) => new Month_1.default({ explicit: Object.assign(Object.assign({}, req.body), { userId: req.userId }) })
    .post()
    .then((month) => res.status(200).json(month.getFormattedResponse()));
exports.getMonth = (req, res) => Month_1.default.getMonth(req.userId, {
    ref: req.params.monthId,
    date: req.params.monthId === "current" && new Date(),
}).then((month) => res.status(200).json(month.getFormattedResponse()));

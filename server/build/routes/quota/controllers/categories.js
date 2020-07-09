"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putCategory = exports.getCategory = exports.postCategory = exports.getCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
exports.getCategories = (req, res) => Category_1.default.getAllCategories(req.userId).then((categories) => res
    .status(200)
    .json(categories.map((category) => category.getFormattedResponse())));
exports.postCategory = (req, res) => new Category_1.default({ explicit: Object.assign(Object.assign({}, req.body), { userId: req.userId }) })
    .post()
    .then((category) => res.status(200).json(category.getFormattedResponse()));
exports.getCategory = (req, res) => Category_1.default.getCategory(req.userId, {
    categoryRef: req.params.categoryId,
}).then((category) => res.status(200).json(category.getFormattedResponse()));
exports.putCategory = (req, res) => Category_1.default.getCategory(req.userId, { categoryRef: req.params.categoryId })
    .then((category) => category.updateCategory({ name: req.body.name }))
    .then((category) => res.status(200).json(category.getFormattedResponse()));

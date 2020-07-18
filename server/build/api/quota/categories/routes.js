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
const BudgetCategoryController = __importStar(require("."));
const express_2 = require("../gateway/express");
const plaid_1 = __importDefault(require("../gateway/plaid"));
const months_1 = require("../months");
const common_1 = require("../validations/common");
const router = express_1.default.Router({ mergeParams: true });
router.use("/:categoryId/months", months_1.BudgetMonthRouter);
router.get("/", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetCategoryController.getAllCategories(req.userId).then((categories) => res
    .status(200)
    .json(categories.map((category) => category.getDisplayFormat())))));
router.post("/", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetCategoryController.createAndPostCategory(Object.assign(Object.assign({}, req.body), { userId: req.userId })).then((category) => res.status(200).json(category.getDisplayFormat()))));
router.get("/:categoryId", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetCategoryController.getCategory(req.userId, {
    categoryId: req.params.categoryId,
}).then((category) => res.status(200).json(category.getDisplayFormat()))));
router.put("/:categoryId", common_1.isAuth, express_2.asyncWrapper((req, res) => BudgetCategoryController.getCategory(req.userId, {
    categoryId: req.params.categoryId,
})
    .then((category) => req.body.name && req.body.name !== category.name
    ? BudgetCategoryController.updateCategory(category, {
        name: req.body.name,
        note: req.body.note,
    }).then((category) => BudgetCategoryController.updateLinkedCategoryName(category))
    : category)
    .then((category) => res.status(200).json(category.getDisplayFormat()))));
router.post("/default", common_1.isAuth, express_2.asyncWrapper((req, res) => plaid_1.default
    .getPlaidClient()
    .getCategories()
    .then(({ categories }) => BudgetCategoryController.createDefaultCategories(req.userId, categories))
    .then((categories) => BudgetCategoryController.postCategories(categories))
    .then((categories) => res
    .status(200)
    .json(categories.map((category) => category.getDisplayFormat())))));
exports.default = router;

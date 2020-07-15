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
exports.updateCategory = exports.postCategories = exports.postCategory = exports.getAllCategories = exports.getCategoryReferenceById = exports.getCategory = exports.createAndPostCategory = exports.createCategory = exports.updateLinkedCategoryName = exports.deleteCategories = exports.createDefaultCategories = exports.BudgetCategory = exports.BudgetCategoryRoutes = void 0;
const BudgetCategoryBusiness = __importStar(require("./business"));
const model_1 = __importDefault(require("./model"));
exports.BudgetCategory = model_1.default;
const BudgetCategoryPersistence = __importStar(require("./persistence"));
const routes_1 = __importDefault(require("./routes"));
exports.BudgetCategoryRoutes = routes_1.default;
const { createDefaultCategories, updateLinkedCategoryName, } = BudgetCategoryBusiness;
exports.createDefaultCategories = createDefaultCategories;
exports.updateLinkedCategoryName = updateLinkedCategoryName;
const { createCategory, createAndPostCategory, getCategory, getCategoryReferenceById, getAllCategories, postCategory, postCategories, updateCategory, deleteCategories, } = BudgetCategoryPersistence;
exports.createCategory = createCategory;
exports.createAndPostCategory = createAndPostCategory;
exports.getCategory = getCategory;
exports.getCategoryReferenceById = getCategoryReferenceById;
exports.getAllCategories = getAllCategories;
exports.postCategory = postCategory;
exports.postCategories = postCategories;
exports.updateCategory = updateCategory;
exports.deleteCategories = deleteCategories;

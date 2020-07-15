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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLinkedCategoryName = exports.createDefaultCategories = void 0;
const _1 = require(".");
const BudgetTransactionController = __importStar(require("../transactions"));
exports.createDefaultCategories = (userId, categories) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryMap = categories.reduce((prev, curr) => {
        // exisiting or new main category add id
        const key = curr.hierarchy[0];
        (prev[key] || (prev[key] = [])).push(curr.category_id);
        return prev;
    }, {});
    return Object.entries(categoryMap).map(([key, value]) => _1.createCategory({
        explicit: {
            name: key,
            plaidCategoryIds: value,
            userId: userId,
        },
    }));
});
exports.updateLinkedCategoryName = (category) => __awaiter(void 0, void 0, void 0, function* () {
    yield BudgetTransactionController.getAllTransactions(category.userId, {
        categoryRef: category,
    }).then((transactions) => Promise.all(transactions.map((transaction) => BudgetTransactionController.updateTransaction(transaction, {
        categoryName: category.name,
    }))));
    return category;
});

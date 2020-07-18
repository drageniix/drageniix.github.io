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
exports.getMonth = exports.getMonthReferenceById = exports.getAllMonths = exports.updateMonth = exports.createAndPostMonth = exports.postMonth = exports.createMonth = void 0;
const _1 = require(".");
const BudgetCategoryController = __importStar(require("../categories"));
const persistence_1 = require("../gateway/persistence");
exports.createMonth = (parameters) => new _1.BudgetMonth(parameters);
exports.postMonth = (month) => __awaiter(void 0, void 0, void 0, function* () {
    yield persistence_1.postModelToCollection(month, month.categoryId.collection(persistence_1.CollectionTypes.MONTHS));
    return month;
});
exports.createAndPostMonth = (explicit) => __awaiter(void 0, void 0, void 0, function* () { return exports.postMonth(exports.createMonth({ explicit })); });
exports.updateMonth = (month, { amount, budget, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount) {
        month.balance += amount;
        month.activity += amount;
    }
    month.budgeted = budget || month.budgeted;
    yield persistence_1.updateModel(month);
    return month;
});
exports.getAllMonths = (categoryRef) => __awaiter(void 0, void 0, void 0, function* () {
    return categoryRef
        .collection(persistence_1.CollectionTypes.MONTHS)
        .orderBy("date", "desc")
        .get()
        .then((months) => months.docs.map((snapshot) => exports.createMonth({ snapshot })));
});
exports.getMonthReferenceById = (categoryRef, monthRef) => persistence_1.getDocumentReference(categoryRef, monthRef, persistence_1.CollectionTypes.MONTHS);
exports.getMonth = (userRef, { categoryId, monthId, date, }) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield BudgetCategoryController.getCategory(userRef, {
        categoryId,
    });
    if (date) {
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        // search
        return category.id
            .collection("months")
            .orderBy("date")
            .startAt(startDate)
            .endBefore(endDate)
            .get()
            .then((months) => months.docs.length === 1
            ? exports.createMonth({ snapshot: months.docs[0] })
            : exports.createAndPostMonth({
                date: startDate,
                userId: category.userId,
                categoryId: category.id,
            }));
    }
    else if (monthId) {
        return persistence_1.getDocumentReference(category.id, monthId)
            .get()
            .then((month) => exports.createMonth({ snapshot: month }));
    }
});

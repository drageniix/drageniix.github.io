"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../middleware/firebase");
const Category_1 = __importDefault(require("./Category"));
const Month_1 = __importDefault(require("./Month"));
class BudgetMonthCategory extends firebase_1.FireBaseModel {
    constructor({ explicit, snapshot, }) {
        super({
            explicit,
            snapshot,
        });
        const { activity, budgeted, balance, monthId, categoryId, categoryName, userId, } = explicit || snapshot.data();
        this.activity = activity || 0;
        this.balance = balance || 0;
        this.budgeted = budgeted || 0;
        this.monthId = monthId;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.userId = userId;
    }
    getFormattedResponse() {
        return firebase_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            activity: this.activity,
            budgeted: this.budgeted,
            balance: this.balance,
            categoryId: this.categoryId && this.categoryId.id,
            monthId: this.monthId && this.monthId.id,
            categoryName: this.categoryName,
            userId: this.userId && this.userId.id,
        });
    }
    toFireStore() {
        return firebase_1.filterUndefinedProperties({
            activity: this.activity,
            budgeted: this.budgeted,
            balance: this.balance,
            monthId: this.monthId,
            categoryId: this.categoryId,
            categoryName: this.categoryName,
            userId: this.userId,
        });
    }
    setLinkedValues({ categoryName }) {
        this.categoryName = categoryName || this.categoryName;
    }
    updateMonthCategory({ budget, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateBudget(budget);
        });
    }
    updateBudget(budget) {
        return __awaiter(this, void 0, void 0, function* () {
            const month = yield Month_1.default.getMonth(this.userId, {
                ref: this.monthId,
            });
            yield month.updateBudget(this.budgeted, budget);
            this.budgeted = budget;
            return this.update();
        });
    }
    updateActivity(isIncome, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const month = yield Month_1.default.getMonth(this.userId, {
                ref: this.monthId,
            });
            yield month.updateActivity(isIncome, amount);
            this.activity += amount;
            this.balance = this.balance + this.activity;
            return this.update();
        });
    }
    getFullyPopulatedMonthCategory(userRef) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Category_1.default.getCategory(userRef, {
                categoryRef: this.categoryId,
            });
            return firebase_1.filterUndefinedProperties(Object.assign(Object.assign(Object.assign({}, this.toFireStore()), category.toFireStore()), { id: this.id, name: undefined }));
        });
    }
    update() {
        const _super = Object.create(null, {
            update: { get: () => super.update }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.update.call(this);
            return this;
        });
    }
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.postInternal(this.monthId.collection(firebase_1.CollectionTypes.MONTH_CATEGORIES));
            return this;
        });
    }
    static getAllMonthCategories(userRef, { month, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const monthCategoryCollectionReference = firebase_1.getDocumentReference(userRef, month, firebase_1.CollectionTypes.MONTHS).collection(firebase_1.CollectionTypes.MONTH_CATEGORIES);
            return monthCategoryCollectionReference
                .get()
                .then((monthCategories) => monthCategories.docs.map((category) => new BudgetMonthCategory({ snapshot: category })));
        });
    }
    static getMonthCategory(userRef, { month, category, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const monthCategoryCollectionReference = firebase_1.getDocumentReference(userRef, month, firebase_1.CollectionTypes.MONTHS);
            const categoryReference = firebase_1.getDocumentReference(userRef, category, firebase_1.CollectionTypes.CATEGORIES);
            const monthCategories = yield monthCategoryCollectionReference
                .collection(firebase_1.CollectionTypes.MONTH_CATEGORIES)
                .where("categoryId", "==", categoryReference)
                .get();
            if (monthCategories.docs.length == 1) {
                return new BudgetMonthCategory({ snapshot: monthCategories.docs[0] });
            }
        });
    }
}
exports.default = BudgetMonthCategory;

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
const MonthCategory_1 = __importDefault(require("./MonthCategory"));
class BudgetMonth extends firebase_1.FireBaseModel {
    constructor({ explicit, snapshot, }) {
        super({
            explicit,
            snapshot,
        });
        const { activity, available, budgeted, date, income, overBudget, categories, userId, } = explicit || snapshot.data();
        this.date =
            (snapshot && date && date.toDate()) ||
                (date && new Date(date)) ||
                new Date();
        this.categories = categories;
        this.activity = activity || 0;
        this.available = available || 0;
        this.budgeted = budgeted || 0;
        this.income = income || 0;
        this.overBudget = overBudget || 0;
        this.categories = categories;
        this.userId = userId;
    }
    getFormattedResponse() {
        return firebase_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            userId: this.userId && this.userId.id,
            date: this.date.toDateString(),
            activity: this.activity,
            available: this.available,
            budgeted: this.budgeted,
            income: this.income,
            overBudget: this.overBudget,
        });
    }
    toFireStore() {
        return firebase_1.filterUndefinedProperties({
            date: this.date,
            activity: this.activity,
            available: this.available,
            budgeted: this.budgeted,
            income: this.income,
            overBudget: this.overBudget,
            userId: this.userId,
        });
    }
    setLinkedValues() {
        return null;
    }
    updateBudget(oldBudget, newBudget) {
        return __awaiter(this, void 0, void 0, function* () {
            this.budgeted -= oldBudget;
            this.budgeted += newBudget;
            return this.update();
        });
    }
    updateActivity(isIncome, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isIncome) {
                this.income += amount;
            }
            else {
                this.activity += amount;
            }
            return this.update();
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
        const _super = Object.create(null, {
            postInternal: { get: () => super.postInternal }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const allCategories = yield Category_1.default.getAllCategories(this.userId);
            yield _super.postInternal.call(this, this.userId.collection(firebase_1.CollectionTypes.MONTHS));
            this.categories = this.id.collection(firebase_1.CollectionTypes.MONTH_CATEGORIES);
            yield Promise.all(allCategories.map((category) => new MonthCategory_1.default({
                explicit: {
                    monthId: this.id,
                    userId: this.userId,
                    categoryId: category.id,
                    categoryName: category.name,
                },
            }).post()));
            return this;
        });
    }
    static getAllMonths(userRef) {
        return __awaiter(this, void 0, void 0, function* () {
            return userRef
                .collection(firebase_1.CollectionTypes.MONTHS)
                .orderBy("date", "desc")
                .get()
                .then((months) => months.docs.map((snapshot) => new BudgetMonth({ snapshot })));
        });
    }
    static getMonth(userRef, { ref, date, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (date) {
                const startDate = new Date(date);
                startDate.setDate(1);
                const endDate = new Date(startDate);
                endDate.setMonth(startDate.getMonth() + 1);
                // search
                return userRef
                    .collection(firebase_1.CollectionTypes.MONTHS)
                    .orderBy("date")
                    .startAt(startDate)
                    .endBefore(endDate)
                    .get()
                    .then((months) => months.docs.length === 1
                    ? new BudgetMonth({ snapshot: months.docs[0] })
                    : new BudgetMonth({
                        explicit: { date: startDate, userId: userRef },
                    }).post());
            }
            else if (ref) {
                return firebase_1.getDocumentReference(userRef, ref, firebase_1.CollectionTypes.MONTHS)
                    .get()
                    .then((month) => new BudgetMonth({ snapshot: month }));
            }
        });
    }
}
exports.default = BudgetMonth;

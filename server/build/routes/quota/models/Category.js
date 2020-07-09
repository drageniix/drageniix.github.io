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
const plaid_1 = require("../middleware/plaid");
const Month_1 = __importDefault(require("./Month"));
const MonthCategory_1 = __importDefault(require("./MonthCategory"));
const Transaction_1 = __importDefault(require("./Transaction"));
class BudgetCategory extends firebase_1.FireBaseModel {
    constructor({ explicit, snapshot, }) {
        super({
            explicit,
            snapshot,
        });
        const { goalCreationMonth, goalTarget, goalTargetMonth, goalType, goalPriority, active, name, originalName, note, userId, subCategories, subSubCategories, } = explicit || snapshot.data();
        this.goalCreationMonth =
            (snapshot && goalTargetMonth && goalCreationMonth.toDate()) ||
                (goalCreationMonth && new Date(goalTargetMonth));
        this.goalTarget = goalTarget || 0;
        this.goalTargetMonth =
            (snapshot && goalTargetMonth && goalTargetMonth.toDate()) ||
                (goalTargetMonth && new Date(goalTargetMonth));
        this.goalType = goalType;
        this.goalPriority = goalPriority;
        this.active = active || true;
        this.name = name;
        this.originalName = originalName;
        this.note = note;
        this.userId = userId;
        this.subCategories = subCategories;
        this.subSubCategories = subSubCategories;
    }
    getFormattedResponse() {
        return firebase_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            goalCreationMonth: this.goalCreationMonth,
            goalTarget: this.goalTarget,
            goalTargetMonth: this.goalTargetMonth,
            goalType: this.goalType,
            goalPriority: this.goalPriority,
            active: this.active,
            name: this.name,
            originalName: this.originalName,
            note: this.note,
            subCategories: this.subCategories,
            subSubCategories: this.subSubCategories,
            userId: this.userId && this.userId.id,
        });
    }
    toFireStore() {
        return firebase_1.filterUndefinedProperties({
            goalCreationMonth: this.goalCreationMonth,
            goalTarget: this.goalTarget,
            goalTargetMonth: this.goalTargetMonth,
            goalType: this.goalType,
            goalPriority: this.goalPriority,
            active: this.active,
            name: this.name,
            originalName: this.originalName,
            note: this.note,
            subCategories: this.subCategories,
            subSubCategories: this.subSubCategories,
            userId: this.userId,
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
            yield _super.postInternal.call(this, this.userId.collection(firebase_1.CollectionTypes.CATEGORIES));
            return this;
        });
    }
    updateCategory({ name }) {
        return __awaiter(this, void 0, void 0, function* () {
            name && (yield this.updateName(name));
            return this;
        });
    }
    updateName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.name = name;
            yield Transaction_1.default.getAllTransactions(this.userId, {
                category: this,
            }).then((transactions) => Promise.all(transactions.map((transaction) => {
                transaction.setLinkedValues({
                    categoryName: this.name,
                });
                return transaction.update();
            })));
            yield Month_1.default.getAllMonths(this.userId)
                .then((months) => Promise.all(months.map((month) => MonthCategory_1.default.getMonthCategory(this.userId, {
                month,
                category: this,
            }))))
                .then((budgetMonthCategories) => Promise.all(budgetMonthCategories.map((budgetCategory) => {
                budgetCategory.setLinkedValues({ categoryName: this.name });
                return budgetCategory.update();
            })));
            return this.update();
        });
    }
    static getAllCategories(userRef, { description } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = userRef
                .collection(firebase_1.CollectionTypes.CATEGORIES)
                .where("active", "==", true);
            if (description) {
                query = query.where("originalName", "in", description);
            }
            return query
                .get()
                .then((categories) => categories.docs.map((snapshot) => new BudgetCategory({ snapshot })));
        });
    }
    static getCategory(userRef, { categoryRef, plaidCategoryName, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (plaidCategoryName) {
                return userRef
                    .collection(firebase_1.CollectionTypes.CATEGORIES)
                    .where("originalName", "in", plaidCategoryName)
                    .get()
                    .then((categories) => categories.docs.length === 1 &&
                    new BudgetCategory({ snapshot: categories.docs[0] }));
            }
            else if (categoryRef) {
                return firebase_1.getDocumentReference(userRef, categoryRef, firebase_1.CollectionTypes.CATEGORIES)
                    .get()
                    .then((category) => category && new BudgetCategory({ snapshot: category }));
            }
            else
                return null;
        });
    }
    static addAllCategoriesToUser(userRef) {
        return __awaiter(this, void 0, void 0, function* () {
            let categoryMap = {};
            yield plaid_1.getPlaidCategories().then(({ categories }) => {
                categories.forEach((category) => {
                    if (categoryMap[category.hierarchy[0]]) {
                        category.hierarchy.forEach((hierarchy) => {
                            hierarchy[1] &&
                                !categoryMap[category.hierarchy[0]].sub.includes(hierarchy[1]) &&
                                categoryMap[category.hierarchy[0]].sub.push(hierarchy[1]);
                            hierarchy[2] &&
                                !categoryMap[category.hierarchy[0]].subSub.includes(hierarchy[2]) &&
                                categoryMap[category.hierarchy[0]].subSub.push(hierarchy[2]);
                        });
                    }
                    else {
                        categoryMap[category.hierarchy[0]] = {
                            sub: [category.hierarchy[1]],
                            subSub: [category.hierarchy[2]],
                        };
                    }
                });
                return Promise.all(Object.entries(categoryMap).map(([key, value]) => new BudgetCategory({
                    explicit: {
                        name: key,
                        originalName: key,
                        subCategories: value.sub,
                        subSubCategories: value.subSub,
                        userId: userRef,
                    },
                }).post()));
            });
        });
    }
}
exports.default = BudgetCategory;

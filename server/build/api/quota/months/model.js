"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const persistence_1 = require("../gateway/persistence");
class BudgetMonth extends persistence_1.DataBaseModel {
    constructor({ explicit, snapshot, }) {
        super({
            explicit,
            snapshot,
        });
        const { categoryId, activity, budgeted, date, balance, userId } = explicit || snapshot.data();
        this.date =
            (snapshot && date && date.toDate()) ||
                (date && new Date(date)) ||
                new Date();
        this.activity = activity || 0;
        this.budgeted = budgeted || 0;
        this.balance = balance || 0;
        this.userId = userId;
        this.categoryId = categoryId;
    }
    getDisplayFormat() {
        return persistence_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            date: this.date.toDateString(),
            activity: this.activity,
            budgeted: this.budgeted,
            balance: this.balance,
            categoryId: this.categoryId && this.categoryId.id,
        });
    }
    getStorageFormat() {
        return {
            date: this.date,
            activity: this.activity,
            budgeted: this.budgeted,
            balance: this.balance,
            userId: this.userId,
            categoryId: this.categoryId,
        };
    }
}
exports.default = BudgetMonth;

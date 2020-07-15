"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const persistence_1 = require("../../gateway/persistence");
class BudgetMonth extends persistence_1.DataBaseModel {
    constructor({ explicit, snapshot, }) {
        super({
            explicit,
            snapshot,
        });
        const { activity, available, budgeted, date, balance, overBudget, userId } = explicit || snapshot.data();
        this.date =
            (snapshot && date && date.toDate()) ||
                (date && new Date(date)) ||
                new Date();
        this.activity = activity || 0;
        this.available = available || 0;
        this.budgeted = budgeted || 0;
        this.balance = balance || 0;
        this.overBudget = overBudget || 0;
        this.userId = userId;
    }
    getDisplayFormat() {
        return persistence_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            date: this.date.toDateString(),
            activity: this.activity,
            available: this.available,
            budgeted: this.budgeted,
            balance: this.balance,
            overBudget: this.overBudget,
        });
    }
    getStorageFormat() {
        return persistence_1.filterUndefinedProperties({
            date: this.date,
            activity: this.activity,
            available: this.available,
            budgeted: this.budgeted,
            balance: this.balance,
            overBudget: this.overBudget,
            userId: this.userId,
        });
    }
}
exports.default = BudgetMonth;

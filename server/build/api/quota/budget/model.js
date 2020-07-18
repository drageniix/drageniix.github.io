"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const persistence_1 = require("../gateway/persistence");
class BudgetSuggested extends persistence_1.DataBaseModel {
    constructor({ explicit, snapshot, }) {
        super({
            explicit,
            snapshot,
        });
        const { goalCreationMonth, goalTarget, goalTargetMonth, goalType, goalPriority, name, scheduled, underfunded, balance, } = explicit || snapshot.data();
        this.goalCreationMonth =
            (snapshot && goalTargetMonth && goalCreationMonth.toDate()) ||
                (goalCreationMonth && new Date(goalTargetMonth));
        this.goalTarget = goalTarget || 0;
        this.goalTargetMonth =
            (snapshot && goalTargetMonth && goalTargetMonth.toDate()) ||
                (goalTargetMonth && new Date(goalTargetMonth));
        this.goalType = goalType;
        this.goalPriority = goalPriority;
        this.name = name;
        this.scheduled = scheduled;
        this.underfunded = underfunded;
        this.balance = balance;
    }
    getDisplayFormat() {
        return persistence_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            goalCreationMonth: this.goalCreationMonth,
            goalTarget: this.goalTarget,
            goalTargetMonth: this.goalTargetMonth,
            goalType: this.goalType,
            goalPriority: this.goalPriority,
            name: this.name,
            scheduled: this.scheduled,
            underfunded: this.underfunded,
            balance: this.balance,
        });
    }
    getStorageFormat() {
        return {
            goalCreationMonth: this.goalCreationMonth,
            goalTarget: this.goalTarget,
            goalTargetMonth: this.goalTargetMonth,
            goalType: this.goalType,
            goalPriority: this.goalPriority,
            name: this.name,
            scheduled: this.scheduled,
            underfunded: this.underfunded,
            balance: this.balance,
        };
    }
}
exports.default = BudgetSuggested;

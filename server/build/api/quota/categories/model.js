"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const persistence_1 = require("../../gateway/persistence");
class BudgetCategory extends persistence_1.DataBaseModel {
    constructor({ explicit, snapshot, }) {
        super({
            explicit,
            snapshot,
        });
        const { goalCreationMonth, goalTarget, goalTargetMonth, goalType, goalPriority, active, name, note, userId, plaidCategoryIds, } = explicit || snapshot.data();
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
        this.note = note;
        this.userId = userId;
        this.plaidCategoryIds = plaidCategoryIds;
    }
    getDisplayFormat() {
        return persistence_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            goalCreationMonth: this.goalCreationMonth,
            goalTarget: this.goalTarget,
            goalTargetMonth: this.goalTargetMonth,
            goalType: this.goalType,
            goalPriority: this.goalPriority,
            active: this.active,
            name: this.name,
            note: this.note,
            plaidCategoryIds: this.plaidCategoryIds,
        });
    }
    getStorageFormat() {
        return persistence_1.filterUndefinedProperties({
            goalCreationMonth: this.goalCreationMonth,
            goalTarget: this.goalTarget,
            goalTargetMonth: this.goalTargetMonth,
            goalType: this.goalType,
            goalPriority: this.goalPriority,
            active: this.active,
            name: this.name,
            note: this.note,
            plaidCategoryIds: this.plaidCategoryIds,
            userId: this.userId,
        });
    }
}
exports.default = BudgetCategory;

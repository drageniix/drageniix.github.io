"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const persistence_1 = require("../../gateway/persistence");
class BudgetTransactionPayee extends persistence_1.DataBaseModel {
    constructor({ explicit, snapshot, }) {
        super({
            explicit,
            snapshot,
        });
        const { name, originalName, note, transferAccountId, transferAccountName, defaultCategoryId, userId, } = explicit || (snapshot && snapshot.data());
        this.name = name;
        this.note = note;
        this.originalName = originalName || name;
        this.transferAccountId = transferAccountId;
        this.transferAccountName = transferAccountName;
        this.defaultCategoryId = defaultCategoryId;
        this.userId = userId;
    }
    getDisplayFormat() {
        return persistence_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            name: this.name,
            originalName: this.originalName,
            note: this.note,
            defaultCategoryId: this.defaultCategoryId && this.defaultCategoryId.id,
            transferAccountId: this.transferAccountId && this.transferAccountId.id,
            transferAccountName: this.transferAccountName,
        });
    }
    getStorageFormat() {
        return persistence_1.filterUndefinedProperties({
            name: this.name,
            originalName: this.originalName,
            note: this.note,
            defaultCategoryId: this.defaultCategoryId,
            transferAccountId: this.transferAccountId,
            transferAccountName: this.transferAccountName,
            userId: this.userId,
        });
    }
}
exports.default = BudgetTransactionPayee;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const persistence_1 = require("../gateway/persistence");
class BudgetAccount extends persistence_1.DataBaseModel {
    constructor({ explicit, snapshot, }) {
        super({ explicit, snapshot });
        const { name, originalName, availableBalance, currentBalance, startingBalance, note, onBudget, type, subtype, transferPayeeId, transferPayeeName, plaidAccountId, institutionId, institutionName, userId, active, } = explicit || (snapshot && snapshot.data());
        this.name = name;
        this.originalName = originalName || name;
        this.availableBalance = availableBalance || currentBalance || 0;
        this.currentBalance = currentBalance || 0;
        this.startingBalance = startingBalance || currentBalance || 0;
        this.note = note;
        this.active = active || false;
        this.onBudget = onBudget || false;
        this.type = type;
        this.subtype = subtype;
        this.transferPayeeId = transferPayeeId;
        this.transferPayeeName = transferPayeeName;
        this.plaidAccountId = plaidAccountId;
        this.institutionId = institutionId;
        this.institutionName = institutionName;
        this.userId = userId;
    }
    getDisplayFormat() {
        return persistence_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            name: this.name,
            originalName: this.originalName,
            availableBalance: this.availableBalance,
            currentBalance: this.currentBalance,
            startingBalance: this.startingBalance,
            note: this.note,
            onBudget: this.onBudget,
            active: this.active,
            type: this.type,
            subtype: this.subtype,
            transferPayeeId: this.transferPayeeId && this.transferPayeeId.id,
            transferPayeeName: this.transferPayeeName,
            institutionId: this.institutionId && this.institutionId.id,
            institutionName: this.institutionName,
        });
    }
    getStorageFormat() {
        return {
            name: this.name,
            originalName: this.originalName,
            availableBalance: this.availableBalance,
            currentBalance: this.currentBalance,
            startingBalance: this.startingBalance,
            note: this.note,
            onBudget: this.onBudget,
            type: this.type,
            subtype: this.subtype,
            transferPayeeId: this.transferPayeeId,
            transferPayeeName: this.transferPayeeName,
            plaidAccountId: this.plaidAccountId,
            institutionId: this.institutionId,
            institutionName: this.institutionName,
            userId: this.userId,
            active: this.active,
        };
    }
}
exports.default = BudgetAccount;

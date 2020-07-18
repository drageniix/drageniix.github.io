"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const persistence_1 = require("../gateway/persistence");
class BudgetScheduled extends persistence_1.DataBaseModel {
    constructor({ explicit, snapshot, }) {
        super({
            explicit,
            snapshot,
        });
        const { date, amount, note, flagColor, accountId, accountName, payeeId, payeeName, categoryId, categoryName, userId, frequency, } = explicit || snapshot.data();
        this.date =
            (snapshot && date && date.toDate()) ||
                (date && new Date(date)) ||
                new Date();
        this.amount = amount || 0;
        this.note = note;
        this.flagColor = flagColor;
        this.accountId = accountId;
        this.accountName = accountName;
        this.payeeId = payeeId;
        this.payeeName = payeeName;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.userId = userId;
        this.frequency = frequency;
    }
    getDisplayFormat() {
        return persistence_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            date: this.date.toDateString(),
            amount: this.amount,
            note: this.note,
            flagColor: this.flagColor,
            accountId: (typeof this.accountId === "object" && this.accountId.id) ||
                this.accountId,
            accountName: this.accountName,
            payeeId: (typeof this.payeeId === "object" && this.payeeId.id) || this.payeeId,
            payeeName: this.payeeName,
            categoryId: (typeof this.categoryId === "object" && this.categoryId.id) ||
                this.categoryId,
            categoryName: this.categoryName,
        });
    }
    getStorageFormat() {
        return {
            date: this.date,
            amount: this.amount,
            note: this.note,
            flagColor: this.flagColor,
            accountId: this.accountId,
            accountName: this.accountName,
            payeeId: this.payeeId,
            payeeName: this.payeeName,
            categoryId: this.categoryId,
            categoryName: this.categoryName,
            userId: this.userId,
            frequency: this.frequency,
        };
    }
}
exports.default = BudgetScheduled;

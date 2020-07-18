"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const persistence_1 = require("../gateway/persistence");
class BudgetInstitution extends persistence_1.DataBaseModel {
    constructor({ explicit, snapshot, }) {
        super({
            explicit,
            snapshot,
        });
        const { name, note, active, plaidItemId, plaidAccessToken, userId, updatedAt, } = explicit || snapshot.data();
        this.name = name;
        this.note = note;
        this.active = active || true;
        this.plaidItemId = plaidItemId;
        this.plaidAccessToken = plaidAccessToken;
        this.userId = userId;
        this.updatedAt =
            (snapshot && updatedAt && updatedAt.toDate()) ||
                (updatedAt && new Date(updatedAt)) ||
                new Date();
    }
    getStorageFormat() {
        return {
            name: this.name,
            note: this.note,
            active: this.active,
            plaidItemId: this.plaidItemId,
            plaidAccessToken: this.plaidAccessToken,
            userId: this.userId,
            updatedAt: this.updatedAt,
        };
    }
    getDisplayFormat() {
        return persistence_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            name: this.name,
            note: this.note,
            updatedAt: this.updatedAt,
        });
    }
}
exports.default = BudgetInstitution;

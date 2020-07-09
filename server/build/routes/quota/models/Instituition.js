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
const Account_1 = __importDefault(require("./Account"));
class BudgetInstitution extends firebase_1.FireBaseModel {
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
    toFireStore() {
        return firebase_1.filterUndefinedProperties({
            name: this.name,
            note: this.note,
            active: this.active,
            plaidItemId: this.plaidItemId,
            plaidAccessToken: this.plaidAccessToken,
            userId: this.userId,
            updatedAt: this.updatedAt,
        });
    }
    getFormattedResponse() {
        return firebase_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            name: this.name,
            note: this.note,
            userId: this.userId && this.userId.id,
            updatedAt: this.updatedAt,
        });
    }
    setLinkedValues() {
        return;
    }
    post({ accounts, }) {
        const _super = Object.create(null, {
            postInternal: { get: () => super.postInternal }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.postInternal.call(this, this.userId.collection(firebase_1.CollectionTypes.INSTITUTION));
            yield Promise.all(accounts.map((account) => new Account_1.default({
                explicit: {
                    userId: this.userId,
                    institutionId: this.id,
                    name: account.name,
                    originalName: account.official_name,
                    availableBalance: account.balances.available,
                    currentBalance: account.balances.current,
                    startingBalance: account.balances.current,
                    type: account.type,
                    subtype: account.subtype,
                    plaidAccountId: account.account_id,
                },
            }).post()));
            return this;
        });
    }
    static getAllInstitutions(userRef) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = userRef
                .collection(firebase_1.CollectionTypes.INSTITUTION)
                .where("active", "==", true);
            return query
                .get()
                .then((institutions) => institutions.docs.map((snapshot) => new BudgetInstitution({ snapshot })));
        });
    }
}
exports.default = BudgetInstitution;

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
const Transaction_1 = __importDefault(require("./Transaction"));
class BudgetTransactionPayee extends firebase_1.FireBaseModel {
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
    getFormattedResponse() {
        return firebase_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            name: this.name,
            originalName: this.originalName,
            note: this.note,
            defaultCategoryId: this.defaultCategoryId && this.defaultCategoryId.id,
            transferAccountId: this.transferAccountId && this.transferAccountId.id,
            transferAccountName: this.transferAccountName,
            userId: this.userId && this.userId.id,
        });
    }
    toFireStore() {
        return firebase_1.filterUndefinedProperties({
            name: this.name,
            originalName: this.originalName,
            note: this.note,
            defaultCategoryId: this.defaultCategoryId,
            transferAccountId: this.transferAccountId,
            transferAccountName: this.transferAccountName,
            userId: this.userId,
        });
    }
    setLinkedValues({ transferAccountName, transferAccountId, defaultCategoryId, }) {
        this.defaultCategoryId = defaultCategoryId || this.defaultCategoryId;
        this.transferAccountName = transferAccountName || this.transferAccountName;
        this.transferAccountId = transferAccountId || this.transferAccountId;
        this.name =
            (transferAccountName && "TRANSFER: " + this.transferAccountName) ||
                this.name;
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
            yield _super.postInternal.call(this, this.userId.collection(firebase_1.CollectionTypes.PAYEES));
            return this;
        });
    }
    updateName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.name = name;
            if (this.transferAccountId) {
                yield Account_1.default.getAccount(this.userId, {
                    accountRef: this.transferAccountId,
                }).then((account) => {
                    account.setLinkedValues({ transferPayeeName: this.name });
                    return account.update();
                });
            }
            yield Transaction_1.default.getAllTransactions(this.userId, {
                payee: this,
            }).then((transactions) => Promise.all(transactions.map((transaction) => {
                transaction.setLinkedValues({
                    payeeName: this.name,
                });
                return transaction.update();
            })));
            return this.update();
        });
    }
    updatePayee({ name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            name && (yield this.updateName(name));
            return this;
        });
    }
    static getAllPayees(userRef) {
        return __awaiter(this, void 0, void 0, function* () {
            return userRef
                .collection(firebase_1.CollectionTypes.PAYEES)
                .get()
                .then((payees) => payees.docs.map((snapshot) => new BudgetTransactionPayee({ snapshot })));
        });
    }
    static getPayee(userRef, { payeeRef, plaidPayeeName, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (plaidPayeeName) {
                return userRef
                    .collection(firebase_1.CollectionTypes.PAYEES)
                    .where("orginalName", "==", plaidPayeeName)
                    .get()
                    .then((payees) => payees.docs.length === 1 &&
                    new BudgetTransactionPayee({ snapshot: payees.docs[0] }));
            }
            else if (payeeRef) {
                return firebase_1.getDocumentReference(userRef, payeeRef, firebase_1.CollectionTypes.PAYEES)
                    .get()
                    .then((payee) => payee && new BudgetTransactionPayee({ snapshot: payee }));
            }
            else
                return null;
        });
    }
}
exports.default = BudgetTransactionPayee;

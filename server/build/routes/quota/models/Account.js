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
const Payee_1 = __importDefault(require("./Payee"));
const Transaction_1 = __importDefault(require("./Transaction"));
class BudgetAccount extends firebase_1.FireBaseModel {
    constructor({ explicit, snapshot, }) {
        super({ explicit, snapshot });
        const { name, originalName, availableBalance, currentBalance, startingBalance, note, onBudget, type, subtype, transferPayeeId, transferPayeeName, plaidAccountId, institutionId, userId, hidden, } = explicit || (snapshot && snapshot.data());
        this.name = name;
        this.originalName = originalName || name;
        this.availableBalance = availableBalance || currentBalance || 0;
        this.currentBalance = currentBalance || 0;
        this.startingBalance = startingBalance || currentBalance || 0;
        this.note = note;
        this.hidden = hidden || false;
        this.onBudget = onBudget || false;
        this.type = type;
        this.subtype = subtype;
        this.transferPayeeId = transferPayeeId;
        this.transferPayeeName = transferPayeeName;
        this.plaidAccountId = plaidAccountId;
        this.institutionId = institutionId;
        this.userId = userId;
    }
    getFormattedResponse() {
        return firebase_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            name: this.name,
            originalName: this.originalName,
            availableBalance: this.availableBalance,
            currentBalance: this.currentBalance,
            startingBalance: this.startingBalance,
            note: this.note,
            onBudget: this.onBudget,
            type: this.type,
            subtype: this.subtype,
            transferPayeeId: this.transferPayeeId && this.transferPayeeId.id,
            transferPayeeName: this.transferPayeeName,
            plaidAccountId: this.plaidAccountId,
            institutionId: this.institutionId && this.institutionId.id,
            userId: this.userId && this.userId.id,
            hidden: this.hidden,
        });
    }
    toFireStore() {
        return firebase_1.filterUndefinedProperties({
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
            userId: this.userId,
            hidden: this.hidden,
        });
    }
    setLinkedValues({ transferPayeeName }) {
        this.transferPayeeName = transferPayeeName || this.transferPayeeName;
    }
    updateName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.name = name;
            yield Transaction_1.default.getAllTransactions(this.userId, {
                account: this,
            }).then((transactions) => Promise.all(transactions.map((transaction) => {
                transaction.setLinkedValues({
                    accountName: this.name,
                });
                return transaction.update();
            })));
            yield Payee_1.default.getPayee(this.userId, {
                payeeRef: this.transferPayeeId,
            })
                .then((payee) => {
                payee.setLinkedValues({ transferAccountName: this.name });
                this.transferPayeeName = payee.name;
                return payee.update();
            })
                .then((payee) => Transaction_1.default.getAllTransactions(this.userId, {
                payee,
            }).then((transactions) => Promise.all(transactions.map((transaction) => {
                transaction.setLinkedValues({
                    payeeName: this.name,
                });
                return transaction.update();
            }))));
            return this.update();
        });
    }
    updateAccount({ name }) {
        return __awaiter(this, void 0, void 0, function* () {
            name && (yield this.updateName(name));
            return this;
        });
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
    // Override
    post() {
        const _super = Object.create(null, {
            postInternal: { get: () => super.postInternal }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // Create equivalent payee for transfers
            const payeeName = `TRANSFER: ${this.name}`;
            const payee = yield new Payee_1.default({
                explicit: {
                    userId: this.userId,
                    name: payeeName,
                },
            }).post();
            this.transferPayeeId = payee.id;
            this.transferPayeeName = payeeName;
            // Create account in database to generate an id
            yield _super.postInternal.call(this, this.userId.collection(firebase_1.CollectionTypes.ACCOUNTS));
            // Add account id and name to payee
            payee.setLinkedValues({
                transferAccountId: this.id,
                transferAccountName: this.name,
            });
            yield payee.update();
            return this;
        });
    }
    static getAccount(userRef, { accountRef, plaidAccountId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (plaidAccountId) {
                return userRef
                    .collection(firebase_1.CollectionTypes.ACCOUNTS)
                    .where("plaidAccountId", "==", plaidAccountId)
                    .get()
                    .then((accounts) => accounts.docs.length === 1 &&
                    new BudgetAccount({ snapshot: accounts.docs[0] }));
            }
            else if (accountRef) {
                return firebase_1.getDocumentReference(userRef, accountRef, firebase_1.CollectionTypes.ACCOUNTS)
                    .get()
                    .then((account) => account && new BudgetAccount({ snapshot: account }));
            }
            else
                return null;
        });
    }
    static getAllAccounts(userRef) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = userRef
                .collection(firebase_1.CollectionTypes.ACCOUNTS)
                .where("hidden", "==", false);
            return query
                .get()
                .then((categories) => categories.docs.map((snapshot) => new BudgetAccount({ snapshot })));
        });
    }
}
exports.default = BudgetAccount;

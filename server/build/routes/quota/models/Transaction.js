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
const Category_1 = __importDefault(require("./Category"));
const Month_1 = __importDefault(require("./Month"));
const MonthCategory_1 = __importDefault(require("./MonthCategory"));
const Payee_1 = __importDefault(require("./Payee"));
class BudgetTransaction extends firebase_1.FireBaseModel {
    constructor({ explicit, snapshot, }) {
        super({
            explicit,
            snapshot,
        });
        const { date, amount, memo, cleared, flagColor, accountId, accountName, payeeId, payeeName, categoryId, categoryName, userId, institutionId, plaidTransactionId, } = explicit || snapshot.data();
        this.date =
            (snapshot && date && date.toDate()) ||
                (date && new Date(date)) ||
                new Date();
        this.amount = amount || 0;
        this.memo = memo;
        this.cleared = cleared || false;
        this.flagColor = flagColor;
        this.accountId = accountId;
        this.accountName = accountName;
        this.payeeId = payeeId;
        this.payeeName = payeeName;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.userId = userId;
        this.institutionId = institutionId;
        this.plaidTransactionId = plaidTransactionId;
    }
    getFormattedResponse() {
        return firebase_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            date: this.date.toDateString(),
            amount: this.amount,
            memo: this.memo,
            cleared: this.cleared,
            flagColor: this.flagColor,
            accountId: (typeof this.accountId === "object" && this.accountId.id) ||
                this.accountId,
            accountName: this.accountName,
            payeeId: (typeof this.payeeId === "object" && this.payeeId.id) || this.payeeId,
            payeeName: this.payeeName,
            categoryId: (typeof this.categoryId === "object" && this.categoryId.id) ||
                this.categoryId,
            categoryName: this.categoryName,
            userId: this.userId && this.userId.id,
            institutionId: this.institutionId && this.institutionId.id,
            plaidTransactionId: this.plaidTransactionId,
        });
    }
    toFireStore() {
        return firebase_1.filterUndefinedProperties({
            date: this.date,
            amount: this.amount,
            memo: this.memo,
            cleared: this.cleared,
            flagColor: this.flagColor,
            accountId: this.accountId,
            accountName: this.accountName,
            payeeId: this.payeeId,
            payeeName: this.payeeName,
            categoryId: this.categoryId,
            categoryName: this.categoryName,
            userId: this.userId,
            institutionId: this.institutionId,
            plaidTransactionId: this.plaidTransactionId,
        });
    }
    setLinkedValues({ accountName, payeeName, categoryName, }) {
        this.accountName = accountName || this.accountName;
        this.payeeName = payeeName || this.payeeName;
        this.categoryName = categoryName || this.categoryName;
    }
    updateCategoryAmount(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const month = yield Month_1.default.getMonth(this.userId, { date: this.date });
            const category = yield Category_1.default.getCategory(this.userId, {
                categoryRef: this.categoryId,
            });
            const monthCategory = yield MonthCategory_1.default.getMonthCategory(this.userId, {
                month,
                category,
            });
            yield monthCategory.updateActivity(this.amount > 0, amount);
            this.categoryId = monthCategory.categoryId;
            this.categoryName = monthCategory.categoryName;
            return this.update();
        });
    }
    updateAccountAmount(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield Account_1.default.getAccount(this.userId, {
                accountRef: this.accountId,
            });
            account.currentBalance += amount;
            account.availableBalance += amount;
            yield account.update();
            this.accountId = account.id;
            this.accountName = account.name;
            return this.update();
        });
    }
    updateAmount(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateAccountAmount(-this.amount + amount);
            yield this.updateCategoryAmount(-this.amount + amount);
            this.amount = amount;
            return this.update();
        });
    }
    updateDate(newDate) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateCategoryAmount(-this.amount);
            this.date = newDate;
            yield this.updateCategoryAmount(this.amount);
            return this.update();
        });
    }
    updatePayee(payeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payee = yield Payee_1.default.getPayee(this.userId, {
                payeeRef: payeeId,
            });
            this.payeeId = payee.id;
            this.payeeName = payee.name;
            return this.update();
        });
    }
    updateTransaction({ amount, date, payee, }) {
        return __awaiter(this, void 0, void 0, function* () {
            amount && (yield this.updateAmount(amount));
            date && (yield this.updateDate(date));
            payee && (yield this.updatePayee(payee));
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
    post() {
        const _super = Object.create(null, {
            postInternal: { get: () => super.postInternal }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.postInternal.call(this, this.userId.collection(firebase_1.CollectionTypes.TRANSACTIONS));
            if (this.accountId) {
                yield this.updateAccountAmount(this.amount);
            }
            if (this.payeeId) {
                yield this.updatePayee(this.payeeId);
            }
            if (this.categoryId) {
                yield this.updateCategoryAmount(this.amount);
            }
            return this;
        });
    }
    static getAllTransactions(userRef, { account, payee, category, limit, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = userRef
                .collection(firebase_1.CollectionTypes.TRANSACTIONS)
                .orderBy("date", "asc");
            if (account || payee || category) {
                if (account) {
                    query = query.where("accountId", "==", account.id);
                }
                else if (payee) {
                    query = query.where("payeeId", "==", payee.id);
                }
                else if (category) {
                    query = query.where("categoryId", "==", category.id);
                }
            }
            if (limit) {
                query = query.limit(limit);
            }
            const transactions = yield query.get();
            return transactions.docs.map((snapshot) => new BudgetTransaction({ snapshot }));
        });
    }
    static getTransaction(userRef, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            return firebase_1.getDocumentReference(userRef, ref, firebase_1.CollectionTypes.TRANSACTIONS)
                .get()
                .then((transaction) => new BudgetTransaction({ snapshot: transaction }));
        });
    }
    static importTransactions(userRef, transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(transactions.map((transaction) => __awaiter(this, void 0, void 0, function* () {
                const account = yield Account_1.default.getAccount(userRef, {
                    plaidAccountId: transaction.account_id,
                });
                console.log(account.name);
                const category = yield Category_1.default.getCategory(userRef, {
                    plaidCategoryName: transaction.category,
                });
                console.log(category.name);
                const existingPayee = yield Payee_1.default.getPayee(userRef, {
                    plaidPayeeName: transaction.name,
                });
                const payee = existingPayee ||
                    (yield new Payee_1.default({
                        explicit: {
                            name: transaction.name,
                            originalName: transaction.name,
                            userId: userRef,
                            defaultCategoryId: category.id,
                        },
                    }).post());
                console.log(existingPayee === payee, payee.name);
                return new BudgetTransaction({
                    explicit: {
                        accountId: account.id,
                        accountName: account.name,
                        amount: transaction.amount,
                        cleared: !transaction.pending,
                        date: new Date(transaction.date),
                        payeeId: payee.id,
                        payeeName: payee.name,
                        userId: userRef,
                        categoryId: category.id,
                        categoryName: category.name,
                    },
                }).post();
            })));
        });
    }
}
exports.default = BudgetTransaction;

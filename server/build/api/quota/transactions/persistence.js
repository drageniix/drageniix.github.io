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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransaction = exports.getTransaction = exports.getTransactionReferenceById = exports.getAllTransactions = exports.createAndPostTransaction = exports.postTransactions = exports.postTransaction = exports.createTransaction = void 0;
const _1 = require(".");
const account_1 = require("../account");
const categories_1 = require("../categories");
const persistence_1 = require("../gateway/persistence");
const payees_1 = require("../payees");
exports.createTransaction = (parameters) => new _1.BudgetTransaction(parameters);
exports.postTransaction = (transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionRef = transaction.userId.collection(persistence_1.CollectionTypes.TRANSACTIONS);
    if (transaction.plaidTransactionId) {
        const existing = yield collectionRef
            .where("plaidTransactionId", "==", transaction.plaidTransactionId)
            .get();
        if (existing.docs.length === 0) {
            yield persistence_1.postModelToCollection(transaction, collectionRef);
        }
    }
    else {
        yield persistence_1.postModelToCollection(transaction, collectionRef);
    }
    return transaction;
});
exports.postTransactions = (transactions) => __awaiter(void 0, void 0, void 0, function* () { return Promise.all(transactions.map((transaction) => exports.postTransaction(transaction))); });
exports.createAndPostTransaction = (explicit) => exports.postTransaction(exports.createTransaction({ explicit }));
exports.getAllTransactions = (userRef, { accountId, payeeId, categoryId, flagColor, limit, } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    let query = userRef
        .collection(persistence_1.CollectionTypes.TRANSACTIONS)
        .orderBy("date", "asc");
    if (accountId || payeeId || categoryId) {
        if (accountId) {
            const account = account_1.getAccountReferenceById(userRef, accountId);
            query = query.where("accountId", "==", account);
        }
        else if (payeeId) {
            const payee = payees_1.getPayeeReferenceById(userRef, payeeId);
            query = query.where("payeeId", "==", payee);
        }
        else if (categoryId) {
            const category = categories_1.getCategoryReferenceById(userRef, categoryId);
            query = query.where("categoryId", "==", category);
        }
    }
    if (flagColor) {
        query = query.where("flagColor", "==", flagColor);
    }
    if (limit) {
        query = query.limit(limit);
    }
    return query
        .get()
        .then((transactions) => transactions.docs.map((snapshot) => exports.createTransaction({ snapshot })));
});
exports.getTransactionReferenceById = (userRef, transaction) => persistence_1.getDocumentReference(userRef, transaction, persistence_1.CollectionTypes.TRANSACTIONS);
exports.getTransaction = (userRef, ref) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.getTransactionReferenceById(userRef, ref)
        .get()
        .then((snapshot) => exports.createTransaction({ snapshot }));
});
exports.updateTransaction = (model, { accountId, accountName, payeeId, payeeName, categoryId, categoryName, amount, date, note, cleared, flagColor, }) => __awaiter(void 0, void 0, void 0, function* () {
    model.amount = amount || model.amount;
    model.date = date || model.date;
    model.accountId = accountId || model.accountId;
    model.accountName = accountName || model.accountName;
    model.payeeName = payeeName || model.payeeName;
    model.payeeId = payeeId || model.payeeId;
    model.categoryName = categoryName || model.categoryName;
    model.categoryId = categoryId || model.categoryId;
    model.note = note || model.note;
    model.cleared = cleared || model.cleared;
    model.flagColor = flagColor || model.flagColor;
    persistence_1.updateModel(model);
    return model;
});

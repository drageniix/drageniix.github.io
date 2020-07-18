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
exports.updateScheduled = exports.getScheduled = exports.getScheduledReferenceById = exports.getAllScheduleds = exports.createAndPostScheduled = exports.postScheduleds = exports.postScheduled = exports.createScheduled = void 0;
const _1 = require(".");
const account_1 = require("../account");
const categories_1 = require("../categories");
const persistence_1 = require("../gateway/persistence");
const payees_1 = require("../payees");
exports.createScheduled = (parameters) => new _1.BudgetScheduled(parameters);
exports.postScheduled = (scheduled) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionRef = scheduled.userId.collection(persistence_1.CollectionTypes.SCHEDULED_TRANSACTIONS);
    yield persistence_1.postModelToCollection(scheduled, collectionRef);
    return scheduled;
});
exports.postScheduleds = (scheduledTransactions) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(scheduledTransactions.map((scheduled) => exports.postScheduled(scheduled)));
});
exports.createAndPostScheduled = (explicit) => exports.postScheduled(exports.createScheduled({ explicit }));
exports.getAllScheduleds = (userRef, { accountId, payeeId, categoryId, flagColor, limit, scheduledUntil, } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    let query = userRef
        .collection(persistence_1.CollectionTypes.SCHEDULED_TRANSACTIONS)
        .orderBy("date", "asc");
    if (scheduledUntil) {
        query = query.endBefore(scheduledUntil);
    }
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
        .then((scheduledTransactions) => scheduledTransactions.docs.map((snapshot) => exports.createScheduled({ snapshot })));
});
exports.getScheduledReferenceById = (userRef, scheduled) => persistence_1.getDocumentReference(userRef, scheduled, persistence_1.CollectionTypes.SCHEDULED_TRANSACTIONS);
exports.getScheduled = (userRef, ref) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.getScheduledReferenceById(userRef, ref)
        .get()
        .then((snapshot) => exports.createScheduled({ snapshot }));
});
exports.updateScheduled = (model, { accountId, accountName, payeeId, payeeName, categoryId, categoryName, amount, date, note, frequency, flagColor, }) => __awaiter(void 0, void 0, void 0, function* () {
    model.amount = amount || model.amount;
    model.date = date || model.date;
    model.accountId = accountId || model.accountId;
    model.accountName = accountName || model.accountName;
    model.payeeName = payeeName || model.payeeName;
    model.payeeId = payeeId || model.payeeId;
    model.categoryName = categoryName || model.categoryName;
    model.categoryId = categoryId || model.categoryId;
    model.note = note || model.note;
    model.frequency = frequency || model.frequency;
    model.flagColor = flagColor || model.flagColor;
    persistence_1.updateModel(model);
    return model;
});

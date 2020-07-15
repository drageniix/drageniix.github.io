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
exports.getMonth = exports.getAllMonths = exports.updateMonth = exports.createAndPostMonth = exports.postMonth = exports.createMonth = void 0;
const _1 = require(".");
const persistence_1 = require("../../gateway/persistence");
exports.createMonth = (parameters) => new _1.BudgetMonth(parameters);
exports.postMonth = (month) => __awaiter(void 0, void 0, void 0, function* () {
    yield persistence_1.postModelToCollection(month, month.userId.collection(persistence_1.CollectionTypes.MONTHS));
    return month;
});
exports.createAndPostMonth = (explicit) => __awaiter(void 0, void 0, void 0, function* () { return exports.postMonth(exports.createMonth({ explicit })); });
exports.updateMonth = (month, { amount, oldBudget, newBudget, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount) {
        month.balance += amount;
        month.activity += amount;
    }
    if (oldBudget && newBudget) {
        month.budgeted -= oldBudget;
        month.budgeted += newBudget;
    }
    yield persistence_1.updateModel(month);
    return month;
});
exports.getAllMonths = (userRef) => __awaiter(void 0, void 0, void 0, function* () {
    return userRef
        .collection(persistence_1.CollectionTypes.MONTHS)
        .orderBy("date", "desc")
        .get()
        .then((months) => months.docs.map((snapshot) => exports.createMonth({ snapshot })));
});
exports.getMonth = (userRef, { ref, date, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (date) {
        const startDate = new Date(date);
        startDate.setDate(1);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        // search
        return userRef
            .collection(persistence_1.CollectionTypes.MONTHS)
            .orderBy("date")
            .startAt(startDate)
            .endBefore(endDate)
            .get()
            .then((months) => months.docs.length === 1
            ? exports.createMonth({ snapshot: months.docs[0] })
            : exports.createAndPostMonth({ date: startDate, userId: userRef }));
    }
    else if (ref) {
        return persistence_1.getDocumentReference(userRef, ref, persistence_1.CollectionTypes.MONTHS)
            .get()
            .then((month) => exports.createMonth({ snapshot: month }));
    }
});

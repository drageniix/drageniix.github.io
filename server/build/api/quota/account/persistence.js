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
exports.getAllAccounts = exports.getAccount = exports.getAccountReferenceById = exports.createAndPostAccount = exports.postAccounts = exports.postAccount = exports.createAccount = exports.updateAccount = void 0;
const _1 = require(".");
const persistence_1 = require("../gateway/persistence");
const institution_1 = require("../institution");
exports.updateAccount = (account, { name, transferPayeeName, transferPayeeId, availableBalance, currentBalance, note, } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    account.name = name || account.name;
    account.note = note || account.note;
    account.availableBalance = availableBalance || account.availableBalance;
    account.currentBalance = currentBalance || account.currentBalance;
    account.transferPayeeName = transferPayeeName || account.transferPayeeName;
    account.transferPayeeId = transferPayeeId || account.transferPayeeId;
    yield persistence_1.updateModel(account);
    return account;
});
exports.createAccount = (parameters) => new _1.BudgetAccount(parameters);
exports.postAccount = (account) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionRef = account.userId.collection(persistence_1.CollectionTypes.ACCOUNTS);
    if (account.plaidAccountId) {
        const existing = yield collectionRef
            .where("plaidAccountId", "==", account.plaidAccountId)
            .get();
        if (existing.docs.length === 0) {
            yield persistence_1.postModelToCollection(account, collectionRef);
        }
    }
    else {
        yield persistence_1.postModelToCollection(account, collectionRef);
    }
    return account;
});
exports.postAccounts = (accounts) => __awaiter(void 0, void 0, void 0, function* () { return Promise.all(accounts.map((account) => exports.postAccount(account))); });
exports.createAndPostAccount = (explicit) => exports.postAccount(exports.createAccount({ explicit }));
exports.getAccountReferenceById = (userRef, account) => persistence_1.getDocumentReference(userRef, account, persistence_1.CollectionTypes.ACCOUNTS);
exports.getAccount = (userRef, { accountId, plaidAccountId, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (plaidAccountId) {
        return userRef
            .collection(persistence_1.CollectionTypes.ACCOUNTS)
            .where("plaidAccountId", "==", plaidAccountId)
            .get()
            .then((accounts) => accounts.docs.length === 1 &&
            exports.createAccount({ snapshot: accounts.docs[0] }));
    }
    else if (accountId) {
        return exports.getAccountReferenceById(userRef, accountId)
            .get()
            .then((snapshot) => snapshot && exports.createAccount({ snapshot }));
    }
    else
        return null;
});
exports.getAllAccounts = (userRef, { institutionId, } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    let query = userRef
        .collection(persistence_1.CollectionTypes.ACCOUNTS)
        .where("hidden", "==", false);
    if (institutionId) {
        const institution = institution_1.getInstitutionReferenceById(userRef, institutionId);
        query = query.where("institutionId", "==", institution.id);
    }
    return query
        .get()
        .then((categories) => categories.docs.map((snapshot) => exports.createAccount({ snapshot })));
});

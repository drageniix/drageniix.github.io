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
exports.getAccountReferenceById = exports.getAllAccounts = exports.getAccount = exports.createAndPostAccount = exports.postAccounts = exports.postAccount = exports.createAccount = exports.updateAccount = void 0;
const _1 = require(".");
const persistence_1 = require("../../gateway/persistence");
const institution_1 = require("../institution");
exports.updateAccount = (account, { name, transferPayeeName, transferPayeeId, } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    account.name = name;
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
exports.getAccount = (userRef, { accountRef, plaidAccountId, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (plaidAccountId) {
        return userRef
            .collection(persistence_1.CollectionTypes.ACCOUNTS)
            .where("plaidAccountId", "==", plaidAccountId)
            .get()
            .then((accounts) => accounts.docs.length === 1 &&
            exports.createAccount({ snapshot: accounts.docs[0] }));
    }
    else if (accountRef) {
        return exports.getAccountReferenceById(userRef, accountRef)
            .get()
            .then((snapshot) => snapshot && exports.createAccount({ snapshot }));
    }
    else
        return null;
});
exports.getAllAccounts = (userRef, { institutionRef, } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    let query = userRef
        .collection(persistence_1.CollectionTypes.ACCOUNTS)
        .where("hidden", "==", false);
    if (institutionRef) {
        const institutionId = institution_1.getInstitutionReferenceById(userRef, institutionRef);
        query = query.where("institutionId", "==", institutionId.id);
    }
    return query
        .get()
        .then((categories) => categories.docs.map((snapshot) => exports.createAccount({ snapshot })));
});
exports.getAccountReferenceById = (userRef, account) => persistence_1.getDocumentReference(userRef, account, persistence_1.CollectionTypes.ACCOUNTS);

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
exports.getAllPayees = exports.getPayee = exports.getPayeeReferenceById = exports.createAndPostPayee = exports.postPayee = exports.updatePayee = exports.createPayee = void 0;
const _1 = require(".");
const persistence_1 = require("../gateway/persistence");
exports.createPayee = (parameters) => new _1.BudgetPayee(parameters);
exports.updatePayee = (payee, { name, note, transferAccountName, transferAccountId, } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    payee.name = name || payee.name;
    payee.note = note || payee.note;
    payee.transferAccountName = transferAccountName || payee.transferAccountName;
    payee.transferAccountId = transferAccountId || payee.transferAccountId;
    yield persistence_1.updateModel(payee);
    return payee;
});
exports.postPayee = (payee) => __awaiter(void 0, void 0, void 0, function* () {
    yield persistence_1.postModelToCollection(payee, payee.userId.collection(persistence_1.CollectionTypes.PAYEES));
    return payee;
});
exports.createAndPostPayee = (explicit) => exports.postPayee(exports.createPayee({ explicit }));
exports.getPayeeReferenceById = (userRef, payee) => persistence_1.getDocumentReference(userRef, payee, persistence_1.CollectionTypes.PAYEES);
exports.getPayee = (userRef, { payeeId, plaidPayeeId, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (plaidPayeeId) {
        return userRef
            .collection(persistence_1.CollectionTypes.PAYEES)
            .where("plaidPayeeId", "==", plaidPayeeId)
            .get()
            .then((Payees) => Payees.docs.length === 1 &&
            exports.createPayee({
                snapshot: Payees.docs[0],
            }));
    }
    else if (payeeId) {
        return exports.getPayeeReferenceById(userRef, payeeId)
            .get()
            .then((Payee) => Payee && exports.createPayee({ snapshot: Payee }));
    }
    else
        return null;
});
exports.getAllPayees = (userRef) => __awaiter(void 0, void 0, void 0, function* () {
    return userRef
        .collection(persistence_1.CollectionTypes.PAYEES)
        .get()
        .then((payees) => payees.docs.map((snapshot) => exports.createPayee({ snapshot })));
});

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
exports.getInstitution = exports.getInstitutionReferenceById = exports.updateInstitution = exports.getAllInstitutions = exports.createAndPostInstitution = exports.postInstitution = exports.createInstitution = void 0;
const _1 = require(".");
const persistence_1 = require("../../gateway/persistence");
exports.createInstitution = (parameters) => new _1.BudgetInstitution(parameters);
exports.postInstitution = (institution) => __awaiter(void 0, void 0, void 0, function* () {
    yield persistence_1.postModelToCollection(institution, institution.userId.collection(persistence_1.CollectionTypes.INSTITUTION));
    return institution;
});
exports.createAndPostInstitution = (explicit) => __awaiter(void 0, void 0, void 0, function* () { return exports.postInstitution(exports.createInstitution({ explicit })); });
exports.getAllInstitutions = (userRef) => __awaiter(void 0, void 0, void 0, function* () {
    return userRef
        .collection(persistence_1.CollectionTypes.INSTITUTION)
        .where("active", "==", true)
        .get()
        .then((institutions) => institutions.docs.map((snapshot) => exports.createInstitution({ snapshot })));
});
exports.updateInstitution = (institution, { updatedAt, }) => __awaiter(void 0, void 0, void 0, function* () {
    institution.updatedAt = updatedAt || institution.updatedAt;
    yield persistence_1.updateModel(institution);
    return institution;
});
exports.getInstitutionReferenceById = (userRef, institution) => persistence_1.getDocumentReference(userRef, institution, persistence_1.CollectionTypes.INSTITUTION);
exports.getInstitution = (userRef, institutionId) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.getInstitutionReferenceById(userRef, institutionId)
        .get()
        .then((institution) => exports.createInstitution({ snapshot: institution }));
});

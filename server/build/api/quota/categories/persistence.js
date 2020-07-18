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
exports.deleteCategories = exports.updateCategory = exports.getCategory = exports.getAllCategories = exports.getCategoryReferenceById = exports.createAndPostCategory = exports.postCategories = exports.postCategory = exports.createCategory = void 0;
const _1 = require(".");
const persistence_1 = require("../gateway/persistence");
exports.createCategory = (parameters) => new _1.BudgetCategory(parameters);
exports.postCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    yield persistence_1.postModelToCollection(category, category.userId.collection(persistence_1.CollectionTypes.CATEGORIES));
    return category;
});
exports.postCategories = (categories) => __awaiter(void 0, void 0, void 0, function* () { return Promise.all(categories.map((category) => exports.postCategory(category))); });
exports.createAndPostCategory = (explicit) => __awaiter(void 0, void 0, void 0, function* () { return exports.postCategory(exports.createCategory({ explicit })); });
exports.getCategoryReferenceById = (userRef, category) => persistence_1.getDocumentReference(userRef, category, persistence_1.CollectionTypes.CATEGORIES);
exports.getAllCategories = (userRef, { description } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    let query = userRef
        .collection(persistence_1.CollectionTypes.CATEGORIES)
        .where("active", "==", true);
    if (description) {
        query = query.where("name", "in", description);
    }
    return query
        .get()
        .then((categories) => categories.docs.map((snapshot) => exports.createCategory({ snapshot })));
});
exports.getCategory = (userRef, { categoryId, plaidCategoryId, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (categoryId) {
        return exports.getCategoryReferenceById(userRef, categoryId)
            .get()
            .then((category) => category && exports.createCategory({ snapshot: category }));
    }
    else if (plaidCategoryId) {
        return userRef
            .collection(persistence_1.CollectionTypes.CATEGORIES)
            .where("plaidCategoryIds", "array-contains", plaidCategoryId)
            .get()
            .then((categories) => categories.docs.length === 1 &&
            exports.createCategory({ snapshot: categories.docs[0] }));
    }
    else
        return null;
});
exports.updateCategory = (category, { name, note, }) => __awaiter(void 0, void 0, void 0, function* () {
    category.name = name || category.name;
    category.note = note || category.note;
    yield persistence_1.updateModel(category);
    return category;
});
exports.deleteCategories = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return userId
        .collection(persistence_1.CollectionTypes.CATEGORIES)
        .get()
        .then((categories) => Promise.all(categories.docs.map((category) => category.ref.delete())))
        .then((results) => results[0] && results[0].writeTime.toDate());
});

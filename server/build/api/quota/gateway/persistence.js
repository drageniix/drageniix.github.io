"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
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
exports.getDocumentReference = exports.postModelToCollection = exports.updateModel = exports.deleteModel = exports.filterUndefinedProperties = exports.DataBaseModel = exports.CollectionTypes = void 0;
const firebase_admin_1 = require("firebase-admin");
const persistence_1 = __importDefault(require("../../../middleware/persistence"));
__exportStar(require("../../../middleware/persistence"), exports);
var CollectionTypes;
(function (CollectionTypes) {
    CollectionTypes["QUOTA"] = "quota";
    CollectionTypes["BUDGET"] = "budget";
    CollectionTypes["USERS"] = "users";
    CollectionTypes["INSTITUTION"] = "institution";
    CollectionTypes["PAYEES"] = "payees";
    CollectionTypes["ACCOUNTS"] = "accounts";
    CollectionTypes["CATEGORIES"] = "categories";
    CollectionTypes["MONTHS"] = "months";
    CollectionTypes["TRANSACTIONS"] = "transactions";
    CollectionTypes["SCHEDULED_TRANSACTIONS"] = "scheduled_transactions";
})(CollectionTypes = exports.CollectionTypes || (exports.CollectionTypes = {}));
class DataBaseModel {
    constructor({ explicit, snapshot, }) {
        this.id = (explicit && explicit.id) || (snapshot && snapshot.ref);
    }
}
exports.DataBaseModel = DataBaseModel;
exports.filterUndefinedProperties = (input, toPersistence = false) => {
    const filteredObject = {};
    Object.entries(input).forEach(([key, value]) => {
        if (typeof value !== "undefined") {
            if (toPersistence) {
                filteredObject[key] =
                    value instanceof Date ? firebase_admin_1.firestore.Timestamp.fromDate(value) : value;
            }
            else {
                filteredObject[key] = value;
            }
        }
    });
    return filteredObject;
};
exports.deleteModel = (model) => __awaiter(void 0, void 0, void 0, function* () {
    yield model.id.delete();
    return model;
});
exports.updateModel = (model) => __awaiter(void 0, void 0, void 0, function* () {
    yield model.id.update(exports.filterUndefinedProperties(model.getStorageFormat(), true));
    return model;
});
exports.postModelToCollection = (model, collection) => __awaiter(void 0, void 0, void 0, function* () {
    model.id = yield collection.add(exports.filterUndefinedProperties(model.getStorageFormat(), true));
    return model;
});
exports.getDocumentReference = (db, ref, collectionType) => (typeof ref === "string" && db.collection(collectionType).doc(ref)) ||
    (ref instanceof DataBaseModel && ref.id) ||
    (ref instanceof firebase_admin_1.firestore.DocumentReference && ref);
exports.default = {
    getDB: (collection) => {
        return persistence_1.default.getFirestoreDB().collection(collection).doc(process.env.NODE_ENV);
    },
};

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
exports.filterUndefinedProperties = exports.getDocumentReference = exports.FireBaseModel = exports.CollectionTypes = void 0;
const firebase_admin_1 = require("firebase-admin");
const firebase_1 = __importDefault(require("../../../middleware/firebase"));
__exportStar(require("../../../middleware/firebase"), exports);
var CollectionTypes;
(function (CollectionTypes) {
    CollectionTypes["QUOTA"] = "quota";
    CollectionTypes["USERS"] = "users";
    CollectionTypes["INSTITUTION"] = "institution";
    CollectionTypes["PAYEES"] = "payees";
    CollectionTypes["ACCOUNTS"] = "accounts";
    CollectionTypes["CATEGORIES"] = "categories";
    CollectionTypes["CATEGORY_GROUPS"] = "category_groups";
    CollectionTypes["MONTHS"] = "months";
    CollectionTypes["MONTH_CATEGORIES"] = "categories";
    CollectionTypes["TRANSACTIONS"] = "transactions";
    CollectionTypes["SCHEDULED_TRANSACTIONS"] = "scheduled_transactions";
})(CollectionTypes = exports.CollectionTypes || (exports.CollectionTypes = {}));
exports.default = {
    getDB: () => {
        return firebase_1.default
            .getFirestoreDB()
            .collection(CollectionTypes.QUOTA)
            .doc(process.env.NODE_ENV);
    },
};
class FireBaseModel {
    constructor({ explicit, snapshot, }) {
        this.id = (explicit && explicit.id) || (snapshot && snapshot.ref);
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.id.delete();
            return this;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.id.update(this.toFireStore());
            return this;
        });
    }
    postInternal(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            this.id = yield collection.add(this.toFireStore());
            return this;
        });
    }
}
exports.FireBaseModel = FireBaseModel;
exports.getDocumentReference = (db, ref, collectionType) => {
    return ((typeof ref === "string" && db.collection(collectionType).doc(ref)) ||
        (ref instanceof FireBaseModel && ref.id) ||
        (ref instanceof firebase_admin_1.firestore.DocumentReference && ref));
};
exports.filterUndefinedProperties = (input) => {
    const filteredObject = {};
    Object.entries(input).forEach(([key, value]) => {
        if (typeof value !== "undefined") {
            filteredObject[key] = value;
        }
    });
    return filteredObject;
};

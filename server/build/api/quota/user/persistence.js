"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getUserReferenceById = exports.createAndPostUser = exports.postUser = exports.updateUser = exports.createUser = void 0;
const _1 = require(".");
const persistence_1 = __importStar(require("../../gateway/persistence"));
exports.createUser = (parameters) => new _1.BudgetUser(parameters);
exports.updateUser = (user, { name, email, privilege }) => __awaiter(void 0, void 0, void 0, function* () {
    name && (user.name = name);
    email && (user.email = email);
    privilege && (user.privilege = privilege);
    yield persistence_1.updateModel(user);
    return user;
});
exports.postUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield persistence_1.postModelToCollection(user, persistence_1.default.getDB(persistence_1.CollectionTypes.QUOTA).collection(persistence_1.CollectionTypes.USERS));
    return user;
});
exports.createAndPostUser = (explicit) => exports.postUser(exports.createUser({ explicit }));
exports.getUserReferenceById = (userId) => persistence_1.getDocumentReference(persistence_1.default.getDB(persistence_1.CollectionTypes.QUOTA), userId, persistence_1.CollectionTypes.USERS);
exports.getUser = ({ userRef, email, }) => __awaiter(void 0, void 0, void 0, function* () {
    return userRef
        ? exports.getUserReferenceById(userRef)
            .get()
            .then((user) => exports.createUser({ snapshot: user }))
        : persistence_1.default
            .getDB(persistence_1.CollectionTypes.QUOTA)
            .collection(persistence_1.CollectionTypes.USERS)
            .where("email", "==", email)
            .get()
            .then((users) => users.docs.length === 1 && exports.createUser({ snapshot: users.docs[0] }));
});

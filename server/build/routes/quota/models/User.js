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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Privilege = void 0;
const firebase_1 = __importStar(require("../middleware/firebase"));
const Category_1 = __importDefault(require("./Category"));
var Privilege;
(function (Privilege) {
    Privilege[Privilege["ADMIN"] = 0] = "ADMIN";
    Privilege[Privilege["USER"] = 1] = "USER";
})(Privilege = exports.Privilege || (exports.Privilege = {}));
class User extends firebase_1.FireBaseModel {
    constructor({ explicit, snapshot, }) {
        super({ explicit, snapshot });
        const { name, email, password, privilege } = explicit || (snapshot && snapshot.data());
        this.name = name;
        this.password = password;
        this.email = email;
        this.privilege = privilege || Privilege.USER;
    }
    getFormattedResponse() {
        return firebase_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            name: this.name,
            email: this.email,
            privilege: Privilege[this.privilege],
        });
    }
    toFireStore() {
        return firebase_1.filterUndefinedProperties({
            name: this.name,
            email: this.email,
            password: this.password,
            privilege: this.privilege,
        });
    }
    setLinkedValues() {
        return null;
    }
    updateUser({ name, email, privilege, }) {
        return __awaiter(this, void 0, void 0, function* () {
            name && (this.name = name);
            email && (this.email = email);
            privilege && (this.privilege = privilege);
            return this.update();
        });
    }
    post() {
        const _super = Object.create(null, {
            postInternal: { get: () => super.postInternal }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.postInternal.call(this, firebase_1.default.getDB().collection(firebase_1.CollectionTypes.USERS));
            Category_1.default.addAllCategoriesToUser(this.id);
            return this;
        });
    }
    update() {
        const _super = Object.create(null, {
            update: { get: () => super.update }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.update.call(this);
            return this;
        });
    }
    static getUserReferenceById(ref) {
        return firebase_1.getDocumentReference(firebase_1.default.getDB(), ref, firebase_1.CollectionTypes.USERS);
    }
    // userId
    static getUserById(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getUserReferenceById(ref)
                .get()
                .then((user) => new User({ snapshot: user }));
        });
    }
    // userId
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return firebase_1.default
                .getDB()
                .collection(firebase_1.CollectionTypes.USERS)
                .where("email", "==", email)
                .get()
                .then((users) => users.docs.length === 1 && new User({ snapshot: users.docs[0] }));
        });
    }
}
exports.default = User;

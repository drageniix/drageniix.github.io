"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
let db;
exports.default = {
    init: (firebaseConfigString) => {
        const config = JSON.parse(firebaseConfigString);
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(config),
            databaseURL: `"https://${config.project_id}.firebaseio.com`,
        });
        db = firebase_admin_1.default.firestore();
    },
    getFirestoreDB: () => {
        if (!db)
            throw new Error("Database not found.");
        return db;
    },
};

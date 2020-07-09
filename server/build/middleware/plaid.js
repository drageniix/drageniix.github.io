"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plaid_1 = __importDefault(require("plaid"));
let client;
exports.default = {
    init: (plaidConfigString) => {
        const { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY, PLAID_ENV, } = JSON.parse(plaidConfigString);
        client = new plaid_1.default.Client(PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY, plaid_1.default.environments[PLAID_ENV], { version: "2019-05-29", clientApp: "Quota" });
    },
    getPlaidClient: () => {
        if (!client)
            throw new Error("Plaid client not found.");
        return client;
    },
};

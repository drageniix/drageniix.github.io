"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const safe_1 = __importDefault(require("colors/safe"));
exports.default = {
    info(message, traceId) {
        console.log(safe_1.default.cyan(`[INFO] ${new Date().toLocaleString()} --${traceId || ""}-- ${message}`));
    },
    error(message, traceId) {
        console.log(safe_1.default.red(`[ERROR] ${new Date().toLocaleString()} --${traceId || ""}-- ${message}`));
    },
};

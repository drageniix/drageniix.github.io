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
exports.validateLogin = exports.validateSignup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const BudgetUserController = __importStar(require("."));
const commonMiddleware = __importStar(require("../validations/common"));
exports.validateSignup = [
    express_validator_1.body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email.")
        .custom((email) => BudgetUserController.getUser({ email }).then((user) => {
        if (user) {
            throw new Error("A user with this email already exists.");
        }
    })),
    express_validator_1.body("password")
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters."),
    express_validator_1.body("confirm_password").custom((confirmedPassword, { req }) => {
        if (confirmedPassword !== req.body.password) {
            throw new Error("Passwords don't match.");
        }
        else
            return true;
    }),
    commonMiddleware.inputValidation,
];
exports.validateLogin = [
    express_validator_1.body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email.")
        .custom((email, { req }) => BudgetUserController.getUser({ email }).then((user) => {
        if (!user) {
            throw new Error("A user with this email could not be found.");
        }
        else {
            req.loginAttemptPW = user.password;
        }
    })),
    express_validator_1.body("password")
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters")
        .custom((password, { req: { loginAttemptPW } }) => __awaiter(void 0, void 0, void 0, function* () {
        if (loginAttemptPW && !(yield bcryptjs_1.default.compare(password, loginAttemptPW))) {
            throw new Error("Incorrect email or password.");
        }
    })),
    commonMiddleware.inputValidation,
];

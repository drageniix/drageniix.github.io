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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateSignup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
exports.validateSignup = [
    express_validator_1.body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email.")
        .custom((email, { req }) => user_1.default.getUserByEmail(email).then((user) => {
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
];
exports.validateLogin = [
    express_validator_1.body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email.")
        .custom((email, { req }) => user_1.default.getUserByEmail(email).then((user) => {
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
];

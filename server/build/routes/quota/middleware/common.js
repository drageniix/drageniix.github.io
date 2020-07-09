"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidation = exports.isAuth = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
exports.isAuth = (req, res, next) => {
    let decodedToken;
    const authHeader = req.get("Authorization");
    if (authHeader) {
        decodedToken = jsonwebtoken_1.default.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (decodedToken) {
            const { sub } = decodedToken;
            req.userId = User_1.default.getUserReferenceById(sub);
            return next();
        }
    }
    const error = {
        message: "Not authenticated.",
        statusCode: 401,
    };
    return next(error);
};
exports.inputValidation = (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        const error = {
            message: "Validation failed.",
            statusCode: 422,
        };
        error.data = errors.array();
        return next(error);
    }
    return next();
};

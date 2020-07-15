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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidation = exports.isAuth = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const BudgetUserController = __importStar(require("../user"));
exports.isAuth = (req, res, next) => {
    let decodedToken;
    const authHeader = req.get("Authorization");
    if (authHeader) {
        decodedToken = jsonwebtoken_1.default.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        if (decodedToken) {
            const { sub } = decodedToken;
            req.userId = BudgetUserController.getUserReferenceById(sub);
            return next();
        }
    }
    return next({
        message: "Not authenticated.",
        statusCode: 401,
    });
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

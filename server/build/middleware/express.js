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
exports.handleErrors = exports.handle400Errors = exports.asyncWrapper = void 0;
const logger_1 = __importDefault(require("./logger"));
exports.asyncWrapper = (fn) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fn(req, res, next);
        return Promise.resolve(response);
    }
    catch (err) {
        return next(err);
    }
});
exports.handle400Errors = (req, res, next) => next({
    statusCode: 404,
    message: "Page not found.",
    path: req.url,
});
exports.handleErrors = (error, req, res, next //eslint-disable-line
) => {
    const err = {
        code: error.statusCode || 500,
        method: req.method,
        path: error.path || req.url,
        name: error.name,
        message: error.message ||
            error.name ||
            (typeof error === "string" && error) ||
            "Internal Server Error",
        data: (error.data && Array.isArray(error.data) && [error.data].flat()) ||
            (error.data && [error.data]) ||
            [],
    };
    logger_1.default.error(`STATUS ${err.code}: ${req.method} ${req.url} --- ${error.message}`);
    return res.status(err.code).json(err);
};

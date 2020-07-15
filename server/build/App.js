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
const express = require("express");
const body_parser_1 = require("body-parser");
const routes = __importStar(require("./api"));
const express_1 = require("./middleware/express");
const socket_1 = __importDefault(require("./middleware/socket"));
class App {
    constructor() {
        this.app = express();
        this.app.use(body_parser_1.urlencoded({ extended: true }));
        this.app.use(body_parser_1.json());
        this.setDefaultHeaders();
        this.mountRoutes();
    }
    setDefaultHeaders() {
        this.app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            req.io = socket_1.default.getIO();
            next();
        });
    }
    mountRoutes() {
        this.app.get("/test", (req, res) => {
            req.io.emit("test", { hello: "world" });
            res.status(200).json({
                message: "Hello World!",
            });
        });
        this.app.use("/v1/quota", routes.quota);
        this.app.use(express_1.handle400Errors);
        this.app.use(express_1.handleErrors);
    }
}
exports.default = App;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const body_parser_1 = require("body-parser");
const logger_1 = __importDefault(require("./middleware/logger"));
const socket_1 = __importDefault(require("./middleware/socket"));
const budget_1 = __importDefault(require("./routes/budget"));
class App {
    constructor() {
        this.app = express();
        this.app.use(body_parser_1.urlencoded({ extended: true }));
        this.app.use(body_parser_1.json());
        this.setDefaultHeaders();
        this.mountRoutes();
        this.handleErrors();
    }
    setDefaultHeaders() {
        this.app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            next();
        });
    }
    mountRoutes() {
        this.app.use("/budget", budget_1.default);
        this.app.get("/test", (req, res) => {
            socket_1.default.getIO().emit("test", { hello: "world" });
            res.status(200).json({
                message: "Hello World!",
            });
        });
    }
    handleErrors() {
        this.app.use((req, res) => {
            res.status(404).json({
                message: "Page not found.",
                path: req.url,
            });
        });
        this.app.use((error, req, res, next) => {
            const err = {
                path: req.url,
                message: error.message ||
                    error.name ||
                    (typeof error === "string" && error) ||
                    "Internal Server Error",
                data: error.data,
            };
            logger_1.default.error(`${req.url} ---- ${err.message}`);
            res.status(error.statusCode || 500).json(err);
        });
    }
}
const app = new App();
exports.default = app.app;

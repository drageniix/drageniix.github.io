"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const body_parser_1 = require("body-parser");
const express_1 = require("./middleware/express");
const socket_1 = __importDefault(require("./middleware/socket"));
const routes_1 = __importDefault(require("./routes/quota/routes"));
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
            socket_1.default.getIO().emit("test", { hello: "world" });
            res.status(200).json({
                message: "Hello World!",
            });
        });
        this.app.use("/v1/quota", routes_1.default);
        this.app.use(express_1.handle400Errors);
        this.app.use(express_1.handleErrors);
    }
}
exports.default = App;

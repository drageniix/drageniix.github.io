"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const App_1 = __importDefault(require("./App"));
const middleware_1 = __importDefault(require("./middleware"));
(function () {
    if (process.env.NODE_ENV !== "production") {
        require("dotenv").config();
    }
    if (!process.env.NODE_ENV) {
        throw "No Environment Set!";
    }
    const { app } = new App_1.default();
    const server = http_1.default.createServer(app);
    middleware_1.default(server);
})();

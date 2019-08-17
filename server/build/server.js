"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var App_1 = __importDefault(require("./App"));
var socket_1 = __importDefault(require("./middleware/socket"));
var port = process.env.PORT || 5000;
var server = App_1.default.listen(port);
socket_1.default.init(server);

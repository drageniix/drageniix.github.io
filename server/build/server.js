"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const socket_1 = __importDefault(require("./middleware/socket"));
const server = require('http').Server(App_1.default);
socket_1.default.init(server);
server.listen(process.env.PORT || 5000);

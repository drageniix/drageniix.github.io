"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./socket"));
const server = http_1.default.createServer(App_1.default);
socket_1.default.init(server);
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(port);
});

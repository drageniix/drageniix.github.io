"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const App_1 = __importDefault(require("./App"));
const logger_1 = __importDefault(require("./middleware/logger"));
const socket_1 = __importDefault(require("./middleware/socket"));
const port = process.env.PORT || 5000;
const server = http_1.default.createServer(App_1.default);
socket_1.default.init(server);
server.listen(port, () => {
    logger_1.default.info(`Server open on port ${port}`);
});

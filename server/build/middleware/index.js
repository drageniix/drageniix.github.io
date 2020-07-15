"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const persistence_1 = __importDefault(require("./persistence"));
const plaid_1 = __importDefault(require("./plaid"));
const socket_1 = __importDefault(require("./socket"));
exports.default = (server) => {
    persistence_1.default.init(process.env.FIREBASE_CONFIG);
    plaid_1.default.init(process.env.PLAID_CONFIG);
    socket_1.default.init(server);
    const port = process.env.PORT;
    server.listen(port, () => {
        logger_1.default.info(`Server open on port ${port}`);
    });
    return server;
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const logger_1 = __importDefault(require("./logger"));
let io;
exports.default = {
    init(server) {
        io = socket_io_1.default(server);
        io.on("connection", (socket) => {
            logger_1.default.info("Server socket connected");
            socket.on("disconnect", () => logger_1.default.info("Server socket disconnected."));
        });
    },
    getIO() {
        if (!io)
            throw new Error("No active websocket.");
        return io;
    },
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = __importDefault(require("socket.io"));
var io;
exports.default = {
    init: function (server) {
        return (io = socket_io_1.default(server));
    },
    getIO: function () {
        if (!io)
            throw new Error("No active websocket.");
        return io;
    }
};

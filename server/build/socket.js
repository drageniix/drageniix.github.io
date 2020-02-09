"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
let io;
exports.default = {
    init(server) {
        io = socket_io_1.default(server);
        io.on('connection', socket => {
            console.log('connected');
            socket.on('disconnect', () => console.log('Bye!'));
        });
    },
    getIO() {
        if (!io)
            throw new Error('No active websocket.');
        return io;
    }
};

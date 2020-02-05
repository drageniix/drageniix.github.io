"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
class SocketIO {
    init(server) {
        this.io = socket_io_1.default(server);
        console.log('attempting conenction');
        this.io.on('connection', socket => {
            console.log('connected');
            socket.on('disconnect', () => console.log('Bye!'));
        });
    }
}
exports.default = new SocketIO();

import socket from "socket.io";
import { Server } from "http";

let io: socket.Server;

export default {
  init(server: Server) {
    return (io = socket(server));
  },
  getIO() {
    if (!io) throw new Error("No active websocket.");
    return io;
  }
};

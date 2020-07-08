import { Server } from "http";
import socket from "socket.io";
import logger from "./logger";

let io: socket.Server;

export default {
  init(server: Server): void {
    io = socket(server);
    io.on("connection", (socket) => {
      logger.info("Server socket connected");
      socket.on("disconnect", () => logger.info("Server socket disconnected."));
    });
  },
  getIO(): socket.Server {
    if (!io) throw new Error("No active websocket.");
    return io;
  },
};

import http, { Server } from "http";
import App from "./App";
import db from "./middleware/firebase";
import logger from "./middleware/logger";
import socket from "./middleware/socket";

(function initiateServer(): Server {
  if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }

  if (!process.env.NODE_ENV) {
    throw "No Environmentt Set!";
  }

  const { app } = new App();
  const port = process.env.PORT;
  const server = http.createServer(app);

  db.init();
  socket.init(server);
  server.listen(port, () => {
    logger.info(`Server open on port ${port}`);
  });
  return server;
})();

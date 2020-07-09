import { Server } from "http";
import db from "./firebase";
import logger from "./logger";
import plaid from "./plaid";
import socket from "./socket";

export default (server: Server): Server => {
  db.init(process.env.FIREBASE_CONFIG);
  plaid.init(process.env.PLAID_CONFIG);
  socket.init(server);

  const port = process.env.PORT;
  server.listen(port, () => {
    logger.info(`Server open on port ${port}`);
  });

  return server;
};

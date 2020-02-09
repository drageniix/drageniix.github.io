import http from "http";
import app from "./App";
import logger from "./middleware/logger";
import socket from "./middleware/socket";

const port = process.env.PORT || 5000;
const server = http.createServer(app);

socket.init(server);
server.listen(port, () => {
  logger.info(`Server open on port ${port}`);
});

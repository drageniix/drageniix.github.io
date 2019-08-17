import app from "./App";
import socket from "./middleware/socket";

const port = process.env.PORT || 5000;

const server = app.listen(port);

socket.init(server);

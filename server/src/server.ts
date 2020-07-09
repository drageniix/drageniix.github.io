import http from "http";
import App from "./App";
import initiateServer from "./middleware";

(function (): void {
  if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }

  if (!process.env.NODE_ENV) {
    throw "No Environment Set!";
  }

  const { app } = new App();
  const server = http.createServer(app);

  initiateServer(server);
})();

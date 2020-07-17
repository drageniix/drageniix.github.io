import express = require("express");
import { json, urlencoded } from "body-parser";
import * as routes from "./api";
import {
  CustomRequest,
  handle400Errors,
  handleErrors,
} from "./middleware/express";
import io from "./middleware/socket";

export default class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(urlencoded({ extended: true }));
    this.app.use(json());
    this.setDefaultHeaders();
    this.mountRoutes();
  }

  setDefaultHeaders(): void {
    this.app.use((req: CustomRequest, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      req.io = io.getIO();
      next();
    });
  }

  mountRoutes(): void {
    this.app.get("/test", (req: CustomRequest, res) => {
      req.io.emit("test", { hello: "world" });
      res.status(200).json({
        message: "Hello World!",
      });
    });

    this.app.use("/quota/v1", routes.quota);

    this.app.use(handle400Errors);
    this.app.use(handleErrors);
  }
}

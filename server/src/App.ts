import express = require("express");
import { json, urlencoded } from "body-parser";
import { NextFunction } from "connect";
import logger from "./middleware/logger";
import io from "./middleware/socket";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(urlencoded({ extended: true }));
    this.app.use(json());
    this.setDefaultHeaders();
    this.mountRoutes();
    this.handleErrors();
  }

  setDefaultHeaders(): void {
    this.app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      next();
    });
  }

  mountRoutes(): void {
    this.app.get("/test", (req, res) => {
      io.getIO().emit("test", { hello: "world" });
      res.status(200).json({
        message: "Hello World!"
      });
    });
  }

  handleErrors(): void {
    this.app.use((req, res) => {
      res.status(404).json({
        message: "Page not found.",
        url: req.url
      });
    });

    this.app.use(
      (
        error: {
          statusCode?: number;
          message?: string;
          name?: string;
          data?: any;
        },
        req?: express.Request,
        res?: express.Response,
        next?: NextFunction
      ) => {
        const err = {
          message: error.message || error.name || "Internal Server Error",
          data: error.data
        };
        logger.error(`${req.url} ${err.message}`);
        res.status(error.statusCode || 500).json(err);
      }
    );
  }
}

const app = new App();
export default app.app;

import express = require("express");
import { json, urlencoded } from "body-parser";
import budgetRoutes from "./budget/routes";
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
    this.app.use("/budget", budgetRoutes);

    this.app.get("/test", (req, res) => {
      io.getIO().emit("test", { hello: "world" });
      res.status(200).json({
        message: "Hello World!",
      });
    });
  }

  handleErrors(): void {
    this.app.use((req, res, next) =>
      next({
        statusCode: 404,
        message: "Page not found.",
        path: req.url,
      })
    );

    this.app.use(
      (
        error: {
          statusCode?: number;
          message?: string;
          name?: string;
          data?: any;
          path?: string;
        },
        req?: express.Request,
        res?: express.Response,
        next?: express.NextFunction // eslint-disable-line
      ) => {
        const err = {
          code: error.statusCode || 500,
          path: error.path || req.url,
          message:
            error.message ||
            error.name ||
            (typeof error === "string" && error) ||
            "Internal Server Error",
          data: error.data,
        };
        logger.error(`STATUS ${err.code}: ${req.url} --- ${err.message}`);
        res.status(err.code).json(err);
      }
    );
  }
}

export default App;

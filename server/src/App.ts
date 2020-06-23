import express = require("express");
import { json, urlencoded } from "body-parser";
import logger from "./middleware/logger";
import io from "./middleware/socket";
import budgetRoutes from "./routes/budget";

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
    this.app.use((req, res) => {
      res.status(404).json({
        message: "Page not found.",
        path: req.url,
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
        next?: express.NextFunction
      ) => {
        const err = {
          code: error.statusCode || 500,
          path: req.url,
          message:
            error.message ||
            error.name ||
            (typeof error === "string" && error) ||
            "Internal Server Error",
          data: error.data,
        };
        logger.error(`${req.url} ---- ${err.code} --- ${err.message}`);
        res.status(err.code).json(err);
      }
    );
  }
}

export default App;

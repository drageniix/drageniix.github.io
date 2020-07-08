import express from "express";
import { validationResult } from "express-validator/check";
import jwt from "jsonwebtoken";
import { CustomRequest, Error } from "../../../middleware/express";

export const isAuth = (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  let decodedToken: string | object;
  const authHeader = req.get("Authorization");
  if (authHeader) {
    decodedToken = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    if (decodedToken) {
      const { sub } = decodedToken as {
        sub: string;
      };
      req.userId = sub;
      return next();
    }
  }

  const error: Error = {
    message: "Not authenticated.",
    statusCode: 401,
  };
  return next(error);
};

export const inputValidation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: Error = {
      message: "Validation failed.",
      statusCode: 422,
    };

    error.data = errors.array({ onlyFirstError: true });
    return next(error);
  }
  return next();
};

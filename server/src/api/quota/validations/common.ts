import express from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { CustomRequest, Error } from "../gateway/express";
import * as BudgetUserController from "../user";

export const isAuth = (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
): void => {
  let decodedToken: string | object;
  const authHeader = req.get("Authorization");
  if (authHeader) {
    decodedToken = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    if (decodedToken) {
      const { sub } = decodedToken as {
        sub: string;
      };
      req.userId = BudgetUserController.getUserReferenceById(sub);
      return next();
    }
  }

  return next({
    message: "Not authenticated.",
    statusCode: 401,
  });
};

export const inputValidation = (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: Error = {
      message: "Validation failed.",
      statusCode: 422,
    };

    error.data = errors.array();
    return next(error);
  }
  return next();
};

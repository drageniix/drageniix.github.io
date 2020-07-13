import express from "express";
import { firestore } from "firebase-admin";
import logger from "./logger";

export type Error = {
  statusCode?: number;
  message?: string;
  name?: string;
  data?: any; // eslint-disable-line
  path?: string;
};

export interface CustomRequest extends express.Request {
  io: SocketIO.Server;
  userId: firestore.DocumentReference;
  privilege: string;
}

export const asyncWrapper = (fn: Function) => async (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> => {
  try {
    const response = await fn(req, res, next);
    return Promise.resolve(response);
  } catch (err) {
    return next(err);
  }
};

export const handle400Errors = (
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction
): express.NextFunction | void =>
  next({
    statusCode: 404,
    message: "Page not found.",
    path: req.url,
  });

export const handleErrors = (
  error: Error,
  req?: express.Request,
  res?: express.Response,
  next?: express.NextFunction // eslint-disable-line
): void => {
  const err = {
    code: error.statusCode || 500,
    method: req.method,
    path: error.path || req.url,
    name: error.name,
    message:
      error.message ||
      error.name ||
      (typeof error === "string" && error) ||
      "Internal Server Error",
    data:
      (error.data && Array.isArray(error.data) && [error.data].flat()) ||
      (error.data && [error.data]) ||
      [],
  };
  logger.error(
    `STATUS ${err.code}: ${req.method} ${req.url} --- ${error.message}`
  );
  res.status(err.code).json(err);
};

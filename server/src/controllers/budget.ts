import express from "express";
import fs from "fs-extra";

export const getRaw = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) =>
  fs
    .readJSON("./src/res/current.json")
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err));

export const getPaycheck = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) =>
  fs
    .readJSON("./src/res/paycheck.json")
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err));

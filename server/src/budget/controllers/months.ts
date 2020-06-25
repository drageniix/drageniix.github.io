import express from "express";
import BudgetMonth from "../models/BudgetMonth";

export const getMonths = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetMonth.getAllMonths()
    .then((months) =>
      res.status(200).json(months.map((month) => month.getFormattedResponse()))
    )
    .catch((err) => next(err));

export const postMonth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  new BudgetMonth({ explicit: req.body })
    .post()
    .then((month) => res.status(200).json(month.getFormattedResponse()))
    .catch((err) => next(err));

export const getMonth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetMonth.getMonth({
    ref: req.params.monthId,
    date: req.params.monthId === "current" && new Date(),
  })
    .then((month) => res.status(200).json(month.getFormattedResponse()))
    .catch((err) => next(err));

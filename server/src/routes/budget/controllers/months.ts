import express from "express";
import BudgetMonth from "../models/BudgetMonth";

export const getMonths = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetMonth.getAllMonths().then((months) =>
    res.status(200).json(months.map((month) => month.getFormattedResponse()))
  );

export const postMonth = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  new BudgetMonth({ explicit: req.body })
    .post()
    .then((month) => res.status(200).json(month.getFormattedResponse()));

export const getMonth = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetMonth.getMonth({
    ref: req.params.monthId,
    date: req.params.monthId === "current" && new Date(),
  }).then((month) => res.status(200).json(month.getFormattedResponse()));

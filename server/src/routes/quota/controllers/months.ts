import express from "express";
import { CustomRequest } from "../../../middleware/express";
import BudgetMonth from "../models/Month";

export const getMonths = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetMonth.getAllMonths(req.userId).then((months) =>
    res.status(200).json(months.map((month) => month.getFormattedResponse()))
  );

export const postMonth = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  new BudgetMonth({ explicit: { ...req.body, userId: req.userId } })
    .post()
    .then((month) => res.status(200).json(month.getFormattedResponse()));

export const getMonth = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetMonth.getMonth(req.userId, {
    ref: req.params.monthId,
    date: req.params.monthId === "current" && new Date(),
  }).then((month) => res.status(200).json(month.getFormattedResponse()));

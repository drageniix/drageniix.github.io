import express from "express";
import { CustomRequest } from "../../../middleware/express";
import { BudgetMonthController } from "../controllers";

export const getMonths = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  req.query.date
    ? BudgetMonthController.getMonth(req.userId, {
        date: new Date(req.query.date as string),
      }).then((month) => res.status(200).json(month.getDisplayFormat()))
    : BudgetMonthController.getAllMonths(req.userId).then((months) =>
        res.status(200).json(months.map((month) => month.getDisplayFormat()))
      );

export const getMonthById = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetMonthController.getMonth(req.userId, {
    ref: req.params.monthId,
    date: req.params.monthId === "current" && new Date(),
  }).then((month) => res.status(200).json(month.getDisplayFormat()));

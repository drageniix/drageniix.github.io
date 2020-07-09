import express from "express";
import { CustomRequest } from "../../../middleware/express";
import BudgetMonthCategory from "../models/MonthCategory";

export const getMonthCategories = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetMonthCategory.getAllMonthCategories(req.userId, {
    month: req.params.monthId,
  }).then((monthCategories) =>
    res
      .status(200)
      .json(
        monthCategories.map((monthCategory) =>
          monthCategory.getFormattedResponse()
        )
      )
  );

export const getMonthCategory = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetMonthCategory.getMonthCategory(req.userId, {
    month: req.params.monthId,
    category: req.params.categoryId,
  }).then((monthCategory) =>
    res.status(200).json(monthCategory.getFormattedResponse())
  );

export const putMonthCategory = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetMonthCategory.getMonthCategory(req.userId, {
    month: req.params.monthId,
    category: req.params.categoryId,
  })
    .then((monthCategory) =>
      monthCategory.updateMonthCategory({ budget: req.body.budget })
    )
    .then((monthCategory) =>
      res.status(200).json(monthCategory.getFormattedResponse())
    );

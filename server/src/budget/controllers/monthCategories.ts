import express from "express";
import BudgetMonthCategory from "../models/BudgetMonthCategory";

export const getMonthCategories = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetMonthCategory.getAllMonthCategories({
    month: req.params.monthId,
  })
    .then((monthCategories) =>
      res
        .status(200)
        .json(
          monthCategories.map((monthCategory) =>
            monthCategory.getFormattedResponse()
          )
        )
    )
    .catch((err) => next(err));

export const getMonthCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetMonthCategory.getMonthCategory({
    month: req.params.monthId,
    category: req.params.categoryId,
  })
    .then((monthCategory) =>
      res.status(200).json(monthCategory.getFormattedResponse())
    )
    .catch((err) => next(err));

export const putMonthCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetMonthCategory.getMonthCategory({
    month: req.params.monthId,
    category: req.params.categoryId,
  })
    .then((monthCategory) =>
      monthCategory.updateMonthCategory({ budget: req.body.budget })
    )
    .then((monthCategory) =>
      res.status(200).json(monthCategory.getFormattedResponse())
    )
    .catch((err) => next(err));

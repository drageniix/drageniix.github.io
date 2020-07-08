import express from "express";
import BudgetMonthCategory from "../models/BudgetMonthCategory";

export const getMonthCategories = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetMonthCategory.getAllMonthCategories({
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
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetMonthCategory.getMonthCategory({
    month: req.params.monthId,
    category: req.params.categoryId,
  }).then((monthCategory) =>
    res.status(200).json(monthCategory.getFormattedResponse())
  );

export const putMonthCategory = (
  req: express.Request,
  res: express.Response
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
    );

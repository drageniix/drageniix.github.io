import express from "express";
import BudgetCategory from "../models/BudgetCategory";

export const getCategories = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetCategory.getAllCategories()
    .then((categories) =>
      res
        .status(200)
        .json(categories.map((category) => category.getFormattedResponse()))
    )
    .catch((err) => next(err));

export const postCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  new BudgetCategory({ explicit: req.body })
    .post()
    .then((category) => res.status(200).json(category.getFormattedResponse()))
    .catch((err) => next(err));

export const putCategory = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetCategory.getCategory(req.params.categoryId)
    .then((category) => category.updateCategory({ name: req.body.name }))
    .then((category) => res.status(200).json(category.getFormattedResponse()))
    .catch((err) => next(err));

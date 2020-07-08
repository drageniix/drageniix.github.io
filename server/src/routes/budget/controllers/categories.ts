import express from "express";
import BudgetCategory from "../models/BudgetCategory";

export const getCategories = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetCategory.getAllCategories().then((categories) =>
    res
      .status(200)
      .json(categories.map((category) => category.getFormattedResponse()))
  );

export const postCategory = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  new BudgetCategory({ explicit: req.body })
    .post()
    .then((category) => res.status(200).json(category.getFormattedResponse()));

export const getCategory = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetCategory.getCategory(req.params.categoryId).then((category) =>
    res.status(200).json(category.getFormattedResponse())
  );

export const putCategory = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetCategory.getCategory(req.params.categoryId)
    .then((category) => category.updateCategory({ name: req.body.name }))
    .then((category) => res.status(200).json(category.getFormattedResponse()));

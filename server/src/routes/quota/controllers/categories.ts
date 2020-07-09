import express from "express";
import { CustomRequest } from "../../../middleware/express";
import BudgetCategory from "../models/Category";

export const getCategories = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetCategory.getAllCategories(req.userId).then((categories) =>
    res
      .status(200)
      .json(categories.map((category) => category.getFormattedResponse()))
  );

export const postCategory = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  new BudgetCategory({ explicit: { ...req.body, userId: req.userId } })
    .post()
    .then((category) => res.status(200).json(category.getFormattedResponse()));

export const getCategory = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetCategory.getCategory(req.userId, {
    categoryRef: req.params.categoryId,
  }).then((category) => res.status(200).json(category.getFormattedResponse()));

export const putCategory = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetCategory.getCategory(req.userId, { categoryRef: req.params.categoryId })
    .then((category) => category.updateCategory({ name: req.body.name }))
    .then((category) => res.status(200).json(category.getFormattedResponse()));

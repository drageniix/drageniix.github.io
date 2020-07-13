import express from "express";
import { CustomRequest } from "../../../middleware/express";
import { BudgetCategoryController } from "../controllers";

export const getCategories = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetCategoryController.getAllCategories(req.userId).then((categories) =>
    res
      .status(200)
      .json(categories.map((category) => category.getDisplayFormat()))
  );

export const postCategory = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetCategoryController.createAndPostCategory({
    ...req.body,
    userId: req.userId,
  }).then((category) => res.status(200).json(category.getDisplayFormat()));

export const getCategory = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetCategoryController.getCategory(req.userId, {
    categoryRef: req.params.categoryId,
  }).then((category) => res.status(200).json(category.getDisplayFormat()));

export const putCategory = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetCategoryController.getCategory(req.userId, {
    categoryRef: req.params.categoryId,
  })
    .then((category) =>
      BudgetCategoryController.updateCategory(category, { name: req.body.name })
    )
    .then((category) => res.status(200).json(category.getDisplayFormat()));

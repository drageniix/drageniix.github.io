import express from "express";
import { CustomRequest } from "../../../middleware/express";
import { BudgetCategoryController } from "../controllers";
import plaid from "../gateway/plaid";

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
      req.body.name && req.body.name !== category.name
        ? BudgetCategoryController.updateCategory(category, {
            name: req.body.name,
          }).then((category) =>
            BudgetCategoryController.updateLinkedCategoryName(category)
          )
        : category
    )
    .then((category) => res.status(200).json(category.getDisplayFormat()));

// should only be done once per user!
export const setDefaultCategories = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  plaid
    .getPlaidClient()
    .getCategories()
    .then(({ categories }) =>
      BudgetCategoryController.createDefaultCategories(req.userId, categories)
    )
    .then((categories) => BudgetCategoryController.postCategories(categories))
    .then((categories) =>
      res
        .status(200)
        .json(categories.map((category) => category.getDisplayFormat()))
    );

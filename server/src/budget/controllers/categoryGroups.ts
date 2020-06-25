import express from "express";
import BudgetCategoryGroup from "../models/BudgetCategoryGroup";

export const getCategoryGroups = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetCategoryGroup.getAllCategoryGroups()
    .then((categoryGroups) =>
      res
        .status(200)
        .json(
          categoryGroups.map((categoryGroup) =>
            categoryGroup.getFormattedResponse()
          )
        )
    )
    .catch((err) => next(err));

export const postCategoryGroup = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  new BudgetCategoryGroup({ explicit: req.body })
    .post()
    .then((categoryGroup) =>
      res.status(200).json(categoryGroup.getFormattedResponse())
    )
    .catch((err) => next(err));

export const getCategoryGroup = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetCategoryGroup.getCategoryGroup(req.params.categoryGroupId)
    .then((categoryGroup) =>
      res.status(200).json(categoryGroup.getFormattedResponse())
    )
    .catch((err) => next(err));

export const putCategoryGroup = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetCategoryGroup.getCategoryGroup(req.params.categoryGroupId)
    .then((categoryGroup) =>
      categoryGroup.updateCategoryGroup({ name: req.body.name })
    )
    .then((categoryGroup) =>
      res.status(200).json(categoryGroup.getFormattedResponse())
    )
    .catch((err) => next(err));

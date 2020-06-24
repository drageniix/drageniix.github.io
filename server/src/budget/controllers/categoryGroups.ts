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

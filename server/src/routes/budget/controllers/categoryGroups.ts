import express from "express";
import BudgetCategoryGroup from "../models/BudgetCategoryGroup";

export const getCategoryGroups = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetCategoryGroup.getAllCategoryGroups().then((categoryGroups) =>
    res
      .status(200)
      .json(
        categoryGroups.map((categoryGroup) =>
          categoryGroup.getFormattedResponse()
        )
      )
  );

export const postCategoryGroup = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  new BudgetCategoryGroup({ explicit: req.body })
    .post()
    .then((categoryGroup) =>
      res.status(200).json(categoryGroup.getFormattedResponse())
    );

export const getCategoryGroup = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetCategoryGroup.getCategoryGroup(
    req.params.categoryGroupId
  ).then((categoryGroup) =>
    res.status(200).json(categoryGroup.getFormattedResponse())
  );

export const putCategoryGroup = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetCategoryGroup.getCategoryGroup(req.params.categoryGroupId)
    .then((categoryGroup) =>
      categoryGroup.updateCategoryGroup({ name: req.body.name })
    )
    .then((categoryGroup) =>
      res.status(200).json(categoryGroup.getFormattedResponse())
    );

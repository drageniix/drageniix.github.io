import express from "express";
import * as BudgetSuggestedController from ".";
import { asyncWrapper, CustomRequest } from "../gateway/express";
import { isAuth } from "../validations/common";

export const router = express.Router({ mergeParams: true });

router.get(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetSuggestedController.calculateUnderfunded(
        req.userId,
        new Date(req.query.date as string)
      ).then((budget) => res.status(200).json(budget))
  )
);

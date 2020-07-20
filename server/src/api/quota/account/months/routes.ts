import express from "express";
import * as BudgetMonthController from ".";
import { asyncWrapper, CustomRequest } from "../../gateway/express";
import { isAuth } from "../../validations/common";

export const router = express.Router({ mergeParams: true });

router.get(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetMonthController.getAllAccountMonths(
        req.userId,
        req.params.accountId
      ).then((months) =>
        res.status(200).json(months.map((month) => month.getDisplayFormat()))
      )
  )
);

router.get(
  "/:monthId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetMonthController.getAccountMonth(req.userId, {
        accountId: req.params.accountId,
        monthId: req.params.monthId,
      }).then((month) => res.status(200).json(month.getDisplayFormat()))
  )
);

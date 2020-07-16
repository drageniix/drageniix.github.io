import express from "express";
import * as BudgetMonthController from ".";
import { asyncWrapper, CustomRequest } from "../../../middleware/express";
import { isAuth } from "../validations/common";

const router = express.Router({ mergeParams: true });

router.get(
  "/:categoryId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      req.query.date
        ? BudgetMonthController.getMonth(req.userId, {
            categoryId: req.params.categoryId,
            date: new Date(req.query.date as string),
          }).then((month) => res.status(200).json(month.getDisplayFormat()))
        : BudgetMonthController.getAllMonths(req.userId).then((months) =>
            res
              .status(200)
              .json(months.map((month) => month.getDisplayFormat()))
          )
  )
);

export default router;

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
      BudgetMonthController.getAllMonths(
        req.userId,
        req.params.categoryId
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
      BudgetMonthController.getMonth(req.userId, {
        categoryId: req.params.categoryId,
        monthId: req.params.monthId,
      }).then((month) => res.status(200).json(month.getDisplayFormat()))
  )
);

router.put(
  "/:monthId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetMonthController.getMonth(req.userId, {
        categoryId: req.params.categoryId,
        monthId: req.params.monthId,
      })
        .then(
          (month) =>
            (req.body.budget &&
              BudgetMonthController.updateCategoryMonth(month, {
                budget: req.body.budget,
              })) ||
            month
        )
        .then((month) => res.status(200).json(month.getDisplayFormat()))
  )
);

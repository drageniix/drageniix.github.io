import express from "express";
import * as BudgetCategoryController from ".";
import { asyncWrapper, CustomRequest } from "../../../middleware/express";
import plaid from "../../gateway/plaid";
import { BudgetMonthRouter } from "../months";
import { isAuth } from "../validations/common";

const router = express.Router({ mergeParams: true });

router.use("/:categoryId/months", BudgetMonthRouter);

router.get(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetCategoryController.getAllCategories(req.userId).then((categories) =>
        res
          .status(200)
          .json(categories.map((category) => category.getDisplayFormat()))
      )
  )
);

router.post(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetCategoryController.createAndPostCategory({
        ...req.body,
        userId: req.userId,
      }).then((category) => res.status(200).json(category.getDisplayFormat()))
  )
);

router.get(
  "/:categoryId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetCategoryController.getCategory(req.userId, {
        categoryId: req.params.categoryId,
      }).then((category) => res.status(200).json(category.getDisplayFormat()))
  )
);

router.put(
  "/:categoryId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetCategoryController.getCategory(req.userId, {
        categoryId: req.params.categoryId,
      })
        .then((category) =>
          req.body.name && req.body.name !== category.name
            ? BudgetCategoryController.updateCategory(category, {
                name: req.body.name,
                note: req.body.note,
              }).then((category) =>
                BudgetCategoryController.updateLinkedCategoryName(category)
              )
            : category
        )
        .then((category) => res.status(200).json(category.getDisplayFormat()))
  )
);

router.post(
  "/default",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      plaid
        .getPlaidClient()
        .getCategories()
        .then(({ categories }) =>
          BudgetCategoryController.createDefaultCategories(
            req.userId,
            categories
          )
        )
        .then((categories) =>
          BudgetCategoryController.postCategories(categories)
        )
        .then((categories) =>
          res
            .status(200)
            .json(categories.map((category) => category.getDisplayFormat()))
        )
  )
);

export default router;

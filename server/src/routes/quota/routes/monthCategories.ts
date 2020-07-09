import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as monthCategoriesController from "../controllers/monthCategories";
import { isAuth } from "../middleware/common";
const router = express.Router({ mergeParams: true });

router.get(
  "/",
  isAuth,
  asyncWrapper(monthCategoriesController.getMonthCategories)
);

router.get(
  "/:categoryId",
  isAuth,
  asyncWrapper(monthCategoriesController.getMonthCategory)
);

router.put(
  "/:categoryId",
  isAuth,
  asyncWrapper(monthCategoriesController.putMonthCategory)
);

export default router;

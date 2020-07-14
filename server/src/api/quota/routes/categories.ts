import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as categoryControllers from "../business/categories";
import { isAuth } from "../validations/common";

const router = express.Router({ mergeParams: true });

router.get("/", isAuth, asyncWrapper(categoryControllers.getCategories));

router.post("/", isAuth, asyncWrapper(categoryControllers.postCategory));

router.get(
  "/:categoryId",
  isAuth,
  asyncWrapper(categoryControllers.getCategory)
);

router.put(
  "/:categoryId",
  isAuth,
  asyncWrapper(categoryControllers.putCategory)
);

router.post(
  "/reset",
  isAuth,
  asyncWrapper(categoryControllers.setDefaultCategories)
);

export default router;

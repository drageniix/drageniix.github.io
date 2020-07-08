import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as categoryGroupControllers from "../controllers/categoryGroups";

const router = express.Router({ mergeParams: true });

router.get("/", asyncWrapper(categoryGroupControllers.getCategoryGroups));

router.post("/", asyncWrapper(categoryGroupControllers.postCategoryGroup));

router.get(
  "/:categoryGroupId",
  asyncWrapper(categoryGroupControllers.getCategoryGroup)
);

router.put(
  "/:categoryGroupId",
  asyncWrapper(categoryGroupControllers.putCategoryGroup)
);

export default router;

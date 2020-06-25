import express from "express";
import * as categoryGroupControllers from "../controllers/categoryGroups";

const router = express.Router({ mergeParams: true });

router.get("/", categoryGroupControllers.getCategoryGroups);

router.post("/", categoryGroupControllers.postCategoryGroup);

router.get("/:categoryGroupId", categoryGroupControllers.getCategoryGroup);

router.put("/:categoryGroupId", categoryGroupControllers.putCategoryGroup);

export default router;

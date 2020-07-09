import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as categoryControllers from "../controllers/categories";

const router = express.Router({ mergeParams: true });

router.get("/", asyncWrapper(categoryControllers.getCategories));

router.post("/", asyncWrapper(categoryControllers.postCategory));

router.get("/:categoryId", asyncWrapper(categoryControllers.getCategory));

router.put("/:categoryId", asyncWrapper(categoryControllers.putCategory));

export default router;

import express from "express";
import * as categoryControllers from "../controllers/categories";

const router = express.Router({ mergeParams: true });

router.get("/", categoryControllers.getCategories);

router.post("/", categoryControllers.postCategory);

router.get("/:categoryId", categoryControllers.getCategory);

router.put("/:categoryId", categoryControllers.putCategory);

export default router;

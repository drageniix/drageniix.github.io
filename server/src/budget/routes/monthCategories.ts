import express from "express";
import * as monthCategoriesController from "../controllers/monthCategories";

const router = express.Router({ mergeParams: true });

router.get("/", monthCategoriesController.getMonthCategories);

router.get("/:categoryId", monthCategoriesController.getMonthCategory);

router.put("/:categoryId", monthCategoriesController.putMonthCategory);

export default router;

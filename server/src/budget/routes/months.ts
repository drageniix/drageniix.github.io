import express from "express";
import * as monthControllers from "../controllers/months";
import monthCategoryRoutes from "./monthCategories";

const router = express.Router({ mergeParams: true });

router.use("/:monthId/category", monthCategoryRoutes);

router.get("/", monthControllers.getMonths);

router.post("/", monthControllers.postMonth);

router.get("/:monthId", monthControllers.getMonth);

export default router;

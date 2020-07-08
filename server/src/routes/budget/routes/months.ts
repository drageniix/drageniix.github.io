import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as monthControllers from "../controllers/months";
import monthCategoryRoutes from "./monthCategories";

const router = express.Router({ mergeParams: true });

router.use("/:monthId/category", monthCategoryRoutes);

router.get("/", asyncWrapper(monthControllers.getMonths));

router.post("/", asyncWrapper(monthControllers.postMonth));

router.get("/:monthId", asyncWrapper(monthControllers.getMonth));

export default router;

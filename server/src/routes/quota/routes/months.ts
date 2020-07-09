import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as monthControllers from "../controllers/months";
import { isAuth } from "../middleware/common";
import monthCategoryRoutes from "./monthCategories";

const router = express.Router({ mergeParams: true });

router.use("/:monthId/category", monthCategoryRoutes);

router.get("/", isAuth, asyncWrapper(monthControllers.getMonths));

router.post("/", isAuth, asyncWrapper(monthControllers.postMonth));

router.get("/:monthId", isAuth, asyncWrapper(monthControllers.getMonth));

export default router;

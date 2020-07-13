import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as monthControllers from "../business/months";
import { isAuth } from "../middleware/common";

const router = express.Router({ mergeParams: true });

router.get("/", isAuth, asyncWrapper(monthControllers.getMonths));

router.get("/:monthId", isAuth, asyncWrapper(monthControllers.getMonthById));

export default router;

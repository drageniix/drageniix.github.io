import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as plaidControllers from "../controllers/institution";
import { isAuth } from "../middleware/common";

const router = express.Router({ mergeParams: true });

router.post("/", isAuth, asyncWrapper(plaidControllers.createInstituition));

export default router;

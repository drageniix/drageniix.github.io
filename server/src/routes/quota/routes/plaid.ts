import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as plaidControllers from "../controllers/plaid";
import { isAuth } from "../middleware/common";

const router = express.Router({ mergeParams: true });

router.post(
  "/token",
  isAuth,
  asyncWrapper(plaidControllers.createInstituition)
);

export default router;

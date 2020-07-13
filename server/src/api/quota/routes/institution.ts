import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as plaidControllers from "../business/institution";
import { isAuth } from "../middleware/common";

const router = express.Router({ mergeParams: true });

router.post("/", isAuth, asyncWrapper(plaidControllers.createInstituition));

// router.post(
//   "/import",
//   isAuth,
//   asyncWrapper(plaidControllers.importTransactions)
// );

export default router;

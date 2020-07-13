import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as transactionControllers from "../business/transactions";
import { isAuth } from "../middleware/common";

const router = express.Router({ mergeParams: true });

router.get("/", isAuth, asyncWrapper(transactionControllers.getTransactions));

router.post("/", isAuth, asyncWrapper(transactionControllers.postTransaction));

router.get(
  "/:transactionId",
  isAuth,
  asyncWrapper(transactionControllers.getTransaction)
);

router.put(
  "/:transactionId",
  isAuth,
  asyncWrapper(transactionControllers.putTransaction)
);

export default router;

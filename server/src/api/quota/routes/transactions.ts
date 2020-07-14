import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as transactionControllers from "../business/transactions";
import { isAuth } from "../validations/common";

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

router.get(
  "/import",
  isAuth,
  asyncWrapper(transactionControllers.importTransactions)
);

export default router;

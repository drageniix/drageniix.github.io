import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as transactionControllers from "../controllers/transactions";

const router = express.Router({ mergeParams: true });

router.get("/", asyncWrapper(transactionControllers.getTransactions));

router.post("/", asyncWrapper(transactionControllers.postTransaction));

router.get(
  "/:transactionId",
  asyncWrapper(transactionControllers.getTransaction)
);

router.put(
  "/:transactionId",
  asyncWrapper(transactionControllers.putTransaction)
);

export default router;

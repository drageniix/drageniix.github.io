import express from "express";
import * as transactionControllers from "../controllers/transactions";

const router = express.Router({ mergeParams: true });

router.get("/", transactionControllers.getTransactions);

router.post("/", transactionControllers.postTransaction);

router.get("/:transactionId", transactionControllers.getTransaction);

router.put("/:transactionId", transactionControllers.putTransaction);

export default router;

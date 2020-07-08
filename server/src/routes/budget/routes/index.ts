import express from "express";
import accountRouter from "./accounts";
import categoryRouter from "./categories";
import groupRouter from "./groups";
import monthRouter from "./months";
import payeeRouter from "./payees";
import transactionRouter from "./transactions";

const router = express.Router();

router.use("/account", accountRouter);

router.use("/payee", payeeRouter);

router.use("/group", groupRouter);

router.use("/category", categoryRouter);

router.use("/months", monthRouter);

router.use("/transaction", transactionRouter);

// asyncWrapper(router.get("/scheduled", Controllers.getScheduledTransactions));

// asyncWrapper(router.get("/paycheck", Controllers.getFutureBudget));

export default router;

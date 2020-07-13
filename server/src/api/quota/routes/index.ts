import express from "express";
import accountRouter from "./accounts";
import categoryRouter from "./categories";
import institutionRouter from "./institution";
import monthRouter from "./months";
import payeeRouter from "./payees";
import transactionRouter from "./transactions";
import userRouter from "./user";

const router = express.Router();

router.use("/account", accountRouter);

router.use("/payee", payeeRouter);

router.use("/category", categoryRouter);

router.use("/months", monthRouter);

router.use("/transaction", transactionRouter);

router.use("/user", userRouter);

router.use("/institution", institutionRouter);

export default router;

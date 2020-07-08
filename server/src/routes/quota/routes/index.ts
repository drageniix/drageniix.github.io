import express from "express";
import plaidRouter from "./plaid";
import userRouter from "./user";
const router = express.Router();

router.use("/user", userRouter);

router.use("/plaid", plaidRouter);

export default router;

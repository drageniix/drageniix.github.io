import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as payeeControllers from "../controllers/payees";

const router = express.Router({ mergeParams: true });

router.get("/", asyncWrapper(payeeControllers.getPayees));

router.post("/", asyncWrapper(payeeControllers.postPayee));

router.get("/:payeeId", asyncWrapper(payeeControllers.getPayee));

router.put("/:payeeId", asyncWrapper(payeeControllers.putPayee));

export default router;

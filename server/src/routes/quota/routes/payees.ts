import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as payeeControllers from "../controllers/payees";
import { isAuth } from "../middleware/common";

const router = express.Router({ mergeParams: true });

router.get("/", isAuth, asyncWrapper(payeeControllers.getPayees));

router.post("/", isAuth, asyncWrapper(payeeControllers.postPayee));

router.get("/:payeeId", isAuth, asyncWrapper(payeeControllers.getPayee));

router.put("/:payeeId", isAuth, asyncWrapper(payeeControllers.putPayee));

export default router;

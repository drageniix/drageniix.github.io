import express from "express";
import * as payeeControllers from "../controllers/payees";

const router = express.Router({ mergeParams: true });

router.get("/", payeeControllers.getPayees);

router.post("/", payeeControllers.postPayee);

router.get("/:payeeId", payeeControllers.getPayee);

router.put("/:payeeId", payeeControllers.putPayee);

export default router;

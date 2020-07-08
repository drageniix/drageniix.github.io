import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as accountControllers from "../controllers/accounts";

const router = express.Router({ mergeParams: true });

router.get("/", asyncWrapper(accountControllers.getAccounts));

router.post("/", asyncWrapper(accountControllers.postAccount));

router.get("/:accountId", asyncWrapper(accountControllers.getAccount));

router.put("/:accountId", asyncWrapper(accountControllers.putAccount));

export default router;

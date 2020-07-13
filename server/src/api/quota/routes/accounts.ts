import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as accountControllers from "../business/accounts";
import { isAuth } from "../middleware/common";

const router = express.Router({ mergeParams: true });

router.get("/", isAuth, asyncWrapper(accountControllers.getAccounts));

router.post("/", isAuth, asyncWrapper(accountControllers.postAccount));

router.get("/:accountId", isAuth, asyncWrapper(accountControllers.getAccount));

router.put("/:accountId", isAuth, asyncWrapper(accountControllers.putAccount));

export default router;

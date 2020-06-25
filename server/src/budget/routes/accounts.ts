import express from "express";
import * as accountControllers from "../controllers/accounts";

const router = express.Router({ mergeParams: true });

router.get("/", accountControllers.getAccounts);

router.post("/", accountControllers.postAccount);

router.get("/:accountId", accountControllers.getAccount);

router.put("/:accountId", accountControllers.putAccount);

export default router;

import express from "express";
import * as accountControllers from "../controllers/accounts";
import * as payeeControllers from "../controllers/payees";

const router = express.Router();

router.get("/account", accountControllers.getAccounts);

router.get("/payee", payeeControllers.getPayees);

// router.get("/category", controllers.getCategories);

// router.get("/transaction", controllers.getTransactions);

// router.get("/scheduled", controllers.getScheduledTransactions);

// router.get("/paycheck", controllers.getFutureBudget);

export default router;

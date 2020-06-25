import express from "express";
import * as accountControllers from "../controllers/accounts";
import * as categoryControllers from "../controllers/categories";
import * as categoryGroupControllers from "../controllers/categoryGroups";
import * as monthControllers from "../controllers/months";
import * as payeeControllers from "../controllers/payees";
import * as transactionControllers from "../controllers/transactions";

const router = express.Router();

router.get("/accounts", accountControllers.getAccounts);

router.post("/account", accountControllers.postAccount);

router.put("/account/:accountId", accountControllers.putAccount);

router.get("/payees", payeeControllers.getPayees);

router.post("/payee", payeeControllers.postPayee);

router.get("/groups", categoryGroupControllers.getCategoryGroups);

router.post("/group", categoryGroupControllers.postCategoryGroup);

router.get("/categories", categoryControllers.getCategories);

router.post("/category", categoryControllers.postCategory);

router.get("/months", monthControllers.getMonths);

router.post("/month", monthControllers.postMonth);

router.get("/transactions", transactionControllers.getTransactions);

router.post("/transaction", transactionControllers.postTransaction);

// router.get("/scheduled", controllers.getScheduledTransactions);

// router.get("/paycheck", controllers.getFutureBudget);

export default router;

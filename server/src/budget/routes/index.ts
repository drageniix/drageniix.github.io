import express from "express";
import * as accountControllers from "../controllers/accounts";
import * as categoryGroupControllers from "../controllers/categoryGroups";
import * as payeeControllers from "../controllers/payees";

const router = express.Router();

router.get("/account", accountControllers.getAccounts);

router.post("/account", accountControllers.postAccount);

router.get("/payee", payeeControllers.getPayees);

router.post("/payee", payeeControllers.postPayee);

router.get("/group", categoryGroupControllers.getCategoryGroups);

router.post("/group", categoryGroupControllers.postCategoryGroup);

// router.get("/category", controllers.getCategories);

// router.get("/category", controllers.getCategories);

// router.get("/transaction", controllers.getTransactions);

// router.get("/scheduled", controllers.getScheduledTransactions);

// router.get("/paycheck", controllers.getFutureBudget);

export default router;

import express from "express";
import db from "../middleware/firebase";
import { categoryConverter } from "../models/BudgetCategory";
// import * as controllers from "../../old/budget/budget";

const router = express.Router();

router.get("/", (req, res) =>
  db
    .getDB()
    .collection("categories")
    .get()
    .then((d) => {
      const categories = d.docs.map((c) => categoryConverter.fromFirestore(c));
      res.status(200).json(categories);
    })
);

// router.get("/account", controllers.getAccounts);

// router.get("/payee", controllers.getPayees);

// router.get("/category", controllers.getCategories);

// router.get("/transaction", controllers.getTransactions);

// router.get("/scheduled", controllers.getScheduledTransactions);

// router.get("/paycheck", controllers.getFutureBudget);

export default router;

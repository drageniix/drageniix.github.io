import express from "express";
import * as BudgetTransactionController from ".";
import { asyncWrapper, CustomRequest } from "../../../middleware/express";
import { isAuth } from "../validations/common";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetTransactionController.getAllTransactions(req.userId, {
        accountId: req.query.accountId as string,
        payeeId: req.query.payeeId as string,
        categoryId: req.query.categoryId as string,
      }).then((transactions) =>
        res.status(200).json({
          transactions: transactions.map((transaction) =>
            transaction.getDisplayFormat()
          ),
        })
      )
  )
);

router.post(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetTransactionController.addManualTransaction(req.userId, {
        ...req.body,
        userId: req.userId,
      })
        .then((transaction) =>
          BudgetTransactionController.postTransaction(transaction)
        )
        .then((transaction) =>
          res.status(200).json(transaction.getDisplayFormat())
        )
  )
);

router.get(
  "/:transactionId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetTransactionController.getTransaction(
        req.userId,
        req.params.transactionId
      ).then((transaction) =>
        res.status(200).json(transaction.getDisplayFormat())
      )
  )
);

router.put(
  "/:transactionId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetTransactionController.getTransaction(
        req.userId,
        req.params.transactionId
      )
        .then((
          transaction //TODO: ESSENTIAL LOGIC TO UDATE ACOUNT AND MONTH!!!!!
        ) =>
          BudgetTransactionController.updateTransaction(transaction, {
            amount: req.body.amount,
            date: req.body.date,
            note: req.body.note,
            cleared: req.body.cleared,
          })
        )
        .then((transaction) =>
          res.status(200).json(transaction.getDisplayFormat())
        )
  )
);

router.post(
  "/import",
  isAuth,
  asyncWrapper(
    async (
      req: CustomRequest,
      res: express.Response
    ): Promise<express.Response> =>
      BudgetTransactionController.getPlaidTransactionsFromInstitution(
        req.userId,
        {
          startDate: req.query.startDate as string,
          endDate: req.query.endDate as string,
        }
      )
        .then((transactions) =>
          BudgetTransactionController.postTransactions(transactions)
        )
        .then((transactions) =>
          res
            .status(200)
            .json(
              transactions.map((transaction) => transaction.getDisplayFormat())
            )
        )
  )
);
export default router;

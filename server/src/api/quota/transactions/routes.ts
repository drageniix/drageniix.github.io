import express from "express";
import * as BudgetTransactionController from ".";
import { asyncWrapper, CustomRequest } from "../gateway/express";
import { isAuth } from "../validations/common";

export const router = express.Router({ mergeParams: true });

router.get(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetTransactionController.getAllTransactions(req.userId, {
        accountId: req.query.accountId as string,
        payeeId: req.query.payeeId as string,
        categoryId: req.query.categoryId as string,
        flagColor: req.query.flagColor as string,
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
        accountId: req.body.accountId,
        payeeId: req.body.payeeId,
        categoryId: req.body.categoryId,
        amount: req.body.amount,
        date: req.body.date,
        cleared: req.body.cleared,
        flagColor: req.body.flagColor,
        note: req.body.note,
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
      BudgetTransactionController.updateLinkedAccounAndMonth(
        req.userId,
        req.params.transactionId,
        {
          amount: req.body.amount,
          date: req.body.date,
          note: req.body.note,
          cleared: req.body.cleared,
          flagColor: req.body.flagColor,
        }
      ).then((transaction) =>
        res.status(200).json(transaction.getDisplayFormat())
      )
  )
);

router.post(
  "/:transactionId/duplicate",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetTransactionController.getTransaction(
        req.userId,
        req.params.transactionId
      )
        .then((transaction) =>
          BudgetTransactionController.addManualTransaction(req.userId, {
            accountId: transaction.accountId,
            categoryId: transaction.categoryId,
            payeeId: transaction.payeeId,
            amount: req.body.amount,
            date: req.body.date,
            cleared: req.body.cleared,
            note: req.body.note,
            flagColor: req.body.flagColor,
          })
        )
        .then((transaction) =>
          BudgetTransactionController.postTransaction(transaction)
        )
        .then((transaction) =>
          res.status(200).json(transaction.getDisplayFormat())
        )
  )
);

router.post(
  "/scheduled/:scheduledId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetTransactionController.convertScheduledTransaction(
        req.userId,
        req.params.scheduledId
      )
        .then((transaction) =>
          BudgetTransactionController.postTransaction(transaction)
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
      BudgetTransactionController.importTransactionsFromInstitution(
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

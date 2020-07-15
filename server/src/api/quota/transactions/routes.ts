import express from "express";
import * as BudgetTransactionController from ".";
import { asyncWrapper, CustomRequest } from "../../../middleware/express";
import { getPlaidTransactions } from "../../gateway/plaid";
import * as BudgetInstitutionController from "../institution";
import { isAuth } from "../validations/common";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetTransactionController.getAllTransactions(req.userId, {
        accountRef: req.query.accountId as string,
        payeeRef: req.query.payeeId as string,
        categoryRef: req.query.categoryId as string,
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
      BudgetTransactionController.createAndPostTransaction({
        ...req.body,
        userId: req.userId,
      }).then((transaction) =>
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
        .then((transaction) =>
          BudgetTransactionController.updateTransaction(transaction, {
            amount: req.body.amount,
            date: req.body.date,
          })
        )
        .then((transaction) =>
          res.status(200).json(transaction.getDisplayFormat())
        )
  )
);

router.get(
  "/import",
  isAuth,
  asyncWrapper(
    async (
      req: CustomRequest,
      res: express.Response
    ): Promise<express.Response> =>
      BudgetInstitutionController.getAllInstitutions(req.userId)
        .then((institutions) =>
          Promise.all(
            institutions.map(async (institution) => {
              const startDate =
                  (req.query.start as string) ||
                  institution.updatedAt.toISOString().slice(0, 10),
                endDate =
                  (req.query.end as string) ||
                  new Date().toISOString().slice(0, 10);

              const { transactions } = await getPlaidTransactions(
                institution.plaidAccessToken,
                startDate,
                endDate
              );

              await BudgetInstitutionController.setUpdatedAt(
                institution,
                endDate
              );
              return transactions;
            })
          )
        )
        .then((transactionList) =>
          BudgetTransactionController.importTransactions(
            req.userId,
            [].concat(...transactionList)
          )
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

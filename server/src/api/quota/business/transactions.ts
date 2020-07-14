import express from "express";
import { CustomRequest } from "../../../middleware/express";
import {
  BudgetInstitutionController,
  BudgetTransactionController,
} from "../controllers";
import { getPlaidTransactions } from "../gateway/plaid";

export const getTransactions = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
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
  );

export const postTransaction = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetTransactionController.createAndPostTransaction({
    ...req.body,
    userId: req.userId,
  }).then((transaction) =>
    res.status(200).json(transaction.getDisplayFormat())
  );

export const getTransaction = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetTransactionController.getTransaction(
    req.userId,
    req.params.transactionId
  ).then((transaction) => res.status(200).json(transaction.getDisplayFormat()));

export const putTransaction = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
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
    );

export const importTransactions = async (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetInstitutionController.getAllInstitutions(req.userId)
    .then((institutions) =>
      Promise.all(
        institutions.map(async ({ plaidAccessToken }) => {
          const { transactions } = await getPlaidTransactions(
            plaidAccessToken,
            (req.query.start as string) || "2020-06-01",
            (req.query.end as string) || "2020-06-15"
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
        .json(transactions.map((transaction) => transaction.getDisplayFormat()))
    );

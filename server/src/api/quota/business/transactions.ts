import express from "express";
import { CustomRequest } from "../../../middleware/express";
import { BudgetTransactionController } from "../controllers";

export const getTransactions = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetTransactionController.getAllTransactions(
    req.userId
  ).then((transactions) =>
    res
      .status(200)
      .json(transactions.map((transaction) => transaction.getDisplayFormat()))
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

import express from "express";
import { CustomRequest } from "../../../middleware/express";
import BudgetTransaction from "../models/Transaction";

export const getTransactions = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetTransaction.getAllTransactions(req.userId).then((transactions) =>
    res
      .status(200)
      .json(
        transactions.map((transaction) => transaction.getFormattedResponse())
      )
  );

export const postTransaction = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  new BudgetTransaction({ explicit: { ...req.body, userId: req.userId } })
    .post()
    .then((transaction) =>
      res.status(200).json(transaction.getFormattedResponse())
    );

export const getTransaction = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetTransaction.getTransaction(
    req.userId,
    req.params.transactionId
  ).then((transaction) =>
    res.status(200).json(transaction.getFormattedResponse())
  );

export const putTransaction = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetTransaction.getTransaction(req.userId, req.params.transactionId)
    .then((transaction) =>
      transaction.updateTransaction({
        amount: req.body.amount,
        date: req.body.date,
        payee: req.body.payeeId,
      })
    )
    .then((transaction) =>
      res.status(200).json(transaction.getFormattedResponse())
    );

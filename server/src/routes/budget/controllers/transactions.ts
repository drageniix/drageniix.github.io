import express from "express";
import BudgetTransaction from "../models/BudgetTransaction";

export const getTransactions = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetTransaction.getAllTransactions().then((transactions) =>
    res
      .status(200)
      .json(
        transactions.map((transaction) => transaction.getFormattedResponse())
      )
  );

export const postTransaction = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  new BudgetTransaction({ explicit: req.body })
    .post()
    .then((transaction) =>
      res.status(200).json(transaction.getFormattedResponse())
    );

export const getTransaction = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetTransaction.getTransaction(
    req.params.transactionId
  ).then((transaction) =>
    res.status(200).json(transaction.getFormattedResponse())
  );

export const putTransaction = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetTransaction.getTransaction(req.params.transactionId)
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

import express from "express";
import BudgetTransaction from "../models/BudgetTransaction";

export const getTransactions = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetTransaction.getAllTransactions()
    .then((transactions) =>
      res
        .status(200)
        .json(
          transactions.map((transaction) => transaction.getFormattedResponse())
        )
    )
    .catch((err) => next(err));

export const postTransaction = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  new BudgetTransaction({ explicit: req.body })
    .post()
    .then((transaction) =>
      res.status(200).json(transaction.getFormattedResponse())
    )
    .catch((err) => next(err));

export const getTransaction = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetTransaction.getTransaction(req.params.transactionId)

    .then((transaction) =>
      res.status(200).json(transaction.getFormattedResponse())
    )
    .catch((err) => next(err));

export const putTransaction = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetTransaction.getTransaction(req.params.transactionId)
    .then((transaction) => transaction.updateTransaction(req.body))
    .then((transaction) =>
      res.status(200).json(transaction.getFormattedResponse())
    )
    .catch((err) => next(err));

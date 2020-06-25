import express from "express";
import BudgetTransactionPayee from "../models/BudgetTransactionPayee";

export const getPayees = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetTransactionPayee.getAllPayees()
    .then((payees) =>
      res.status(200).json(payees.map((payee) => payee.getFormattedResponse()))
    )
    .catch((err) => next(err));

export const postPayee = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  new BudgetTransactionPayee({ explicit: req.body })
    .post()
    .then((payee) => res.status(200).json(payee.getFormattedResponse()))
    .catch((err) => next(err));

export const getPayee = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetTransactionPayee.getPayee(req.params.payeeId)
    .then((payee) => res.status(200).json(payee.getFormattedResponse()))
    .catch((err) => next(err));

export const putPayee = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetTransactionPayee.getPayee(req.params.payeeId)
    .then((payee) => payee.updatePayee({ name: req.body.name }))
    .then((payee) => res.status(200).json(payee.getFormattedResponse()))
    .catch((err) => next(err));

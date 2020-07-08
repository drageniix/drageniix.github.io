import express from "express";
import BudgetTransactionPayee from "../models/BudgetTransactionPayee";

export const getPayees = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetTransactionPayee.getAllPayees().then((payees) =>
    res.status(200).json(payees.map((payee) => payee.getFormattedResponse()))
  );

export const postPayee = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  new BudgetTransactionPayee({ explicit: req.body })
    .post()
    .then((payee) => res.status(200).json(payee.getFormattedResponse()));

export const getPayee = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetTransactionPayee.getPayee(req.params.payeeId).then((payee) =>
    res.status(200).json(payee.getFormattedResponse())
  );

export const putPayee = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetTransactionPayee.getPayee(req.params.payeeId)
    .then((payee) => payee.updatePayee({ name: req.body.name }))
    .then((payee) => res.status(200).json(payee.getFormattedResponse()));

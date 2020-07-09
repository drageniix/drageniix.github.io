import express from "express";
import { CustomRequest } from "../../../middleware/express";
import BudgetTransactionPayee from "../models/Payee";

export const getPayees = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetTransactionPayee.getAllPayees(req.userId).then((payees) =>
    res.status(200).json(payees.map((payee) => payee.getFormattedResponse()))
  );

export const postPayee = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  new BudgetTransactionPayee({ explicit: { ...req.body, userId: req.userId } })
    .post()
    .then((payee) => res.status(200).json(payee.getFormattedResponse()));

export const getPayee = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetTransactionPayee.getPayee(req.userId, {
    payeeRef: req.params.payeeId,
  }).then((payee) => res.status(200).json(payee.getFormattedResponse()));

export const putPayee = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetTransactionPayee.getPayee(req.userId, { payeeRef: req.params.payeeId })
    .then((payee) => payee.updatePayee({ name: req.body.name }))
    .then((payee) => res.status(200).json(payee.getFormattedResponse()));

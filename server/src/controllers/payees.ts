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

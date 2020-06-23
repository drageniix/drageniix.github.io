import express from "express";
import BudgetAccount from "../models/BudgetAccount";

export const getAccounts = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetAccount.getAllAccounts()
    .then((accounts) =>
      res
        .status(200)
        .json(accounts.map((account) => account.getFormattedResponse()))
    )
    .catch((err) => next(err));

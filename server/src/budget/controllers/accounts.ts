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

export const postAccount = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  new BudgetAccount({ explicit: req.body })
    .post()
    .then((account) => res.status(200).json(account.getFormattedResponse()))
    .catch((err) => next(err));

export const putAccount = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void | express.Response> =>
  BudgetAccount.getAccount(req.params.accountId)
    .then((account) => account.updateName(req.body.name))
    .then((account) => res.status(200).json(account.getFormattedResponse()))
    .catch((err) => next(err));

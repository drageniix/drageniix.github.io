import express from "express";
import BudgetAccount from "../models/BudgetAccount";

export const getAccounts = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetAccount.getAllAccounts().then((accounts) =>
    res
      .status(200)
      .json(accounts.map((account) => account.getFormattedResponse()))
  );

export const postAccount = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  new BudgetAccount({ explicit: req.body })
    .post()
    .then((account) => res.status(200).json(account.getFormattedResponse()));

export const getAccount = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetAccount.getAccount(req.params.accountId).then((account) =>
    res.status(200).json(account.getFormattedResponse())
  );

export const putAccount = (
  req: express.Request,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetAccount.getAccount(req.params.accountId)
    .then((account) => account.updateAccount({ name: req.body.name }))
    .then((account) => res.status(200).json(account.getFormattedResponse()));

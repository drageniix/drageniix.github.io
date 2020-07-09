import express from "express";
import { CustomRequest } from "../../../middleware/express";
import BudgetAccount from "../models/Account";

export const getAccounts = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetAccount.getAllAccounts(req.userId).then((accounts) =>
    res
      .status(200)
      .json(accounts.map((account) => account.getFormattedResponse()))
  );

export const postAccount = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  new BudgetAccount({ explicit: { ...req.body, userId: req.userId } })
    .post()
    .then((account) => res.status(200).json(account.getFormattedResponse()));

export const getAccount = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetAccount.getAccount(req.userId, {
    accountRef: req.params.accountId,
  }).then((account) => res.status(200).json(account.getFormattedResponse()));

export const putAccount = (
  req: CustomRequest,
  res: express.Response
): Promise<void | express.Response> =>
  BudgetAccount.getAccount(req.userId, { accountRef: req.params.accountId })
    .then((account) => account.updateAccount({ name: req.body.name }))
    .then((account) => res.status(200).json(account.getFormattedResponse()));

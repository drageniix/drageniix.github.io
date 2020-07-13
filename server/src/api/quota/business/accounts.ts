import express from "express";
import { CustomRequest } from "../../../middleware/express";
import * as BudgetAccount from "../controllers/account";

export const getAccounts = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetAccount.getAllAccounts(req.userId).then((accounts) =>
    res.status(200).json(accounts.map((account) => account.getDisplayFormat()))
  );

export const postAccount = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetAccount.createAndPostAccount({
    ...req.body,
    userId: req.userId,
  }).then((account) => res.status(200).json(account.getDisplayFormat()));

export const getAccount = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetAccount.getAccount(req.userId, {
    accountRef: req.params.accountId,
  }).then((account) => res.status(200).json(account.getDisplayFormat()));

export const putAccount = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetAccount.getAccount(req.userId, { accountRef: req.params.accountId })
    .then((account) =>
      BudgetAccount.updateAccount(account, { name: req.body.name })
    )
    .then((account) => res.status(200).json(account.getDisplayFormat()));

import express from "express";
import { CustomRequest } from "../../../middleware/express";
import { BudgetAccountController } from "../controllers";

export const getAccounts = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetAccountController.getAllAccounts(req.userId).then((accounts) =>
    res.status(200).json(accounts.map((account) => account.getDisplayFormat()))
  );

// needs body validation
export const postAccount = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetAccountController.createAndPostAccount({
    ...req.body,
    userId: req.userId,
  })
    .then((account) => BudgetAccountController.createMatchingPayee(account))
    .then(({ account }) => res.status(200).json(account.getDisplayFormat()));

export const getAccount = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetAccountController.getAccount(req.userId, {
    accountRef: req.params.accountId,
  }).then((account) => res.status(200).json(account.getDisplayFormat()));

// req.body.name is the only valid update
export const putAccount = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetAccountController.getAccount(req.userId, {
    accountRef: req.params.accountId,
  })
    .then((account) =>
      BudgetAccountController.updateAccount(account, { name: req.body.name })
    )
    .then(
      (account) =>
        (req.body.name &&
          BudgetAccountController.updateLinkedAccountName(account)) ||
        account
    )
    .then((account) => res.status(200).json(account.getDisplayFormat()));

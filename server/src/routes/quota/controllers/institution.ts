import express from "express";
import { CustomRequest } from "../../../middleware/express";
import {
  exchangePlaidPublicTokenForItem,
  getPlaidTransactions,
} from "../middleware/plaid";
import BudgetInstitution from "../models/Instituition";
import BudgetTransaction from "../models/Transaction";

export const createInstituition = async (
  req: CustomRequest,
  res: express.Response
) => {
  const {
    item_id,
    access_token,
    institution_name,
    accounts,
  } = await exchangePlaidPublicTokenForItem(req.body.token);

  const institution = await new BudgetInstitution({
    explicit: {
      name: institution_name,
      plaidItemId: item_id,
      plaidAccessToken: access_token,
      userId: req.userId,
    },
  }).post({ accounts });

  return res.status(200).json(institution.getFormattedResponse());
};

export const importTransactions = async (
  req: CustomRequest,
  res: express.Response
) => {
  const transactionImportResult = await await BudgetInstitution.getAllInstitutions(
    req.userId
  )
    .then((institutions) =>
      Promise.all(
        institutions.map((institution) =>
          getPlaidTransactions(
            institution.plaidAccessToken,
            institution.updatedAt.toISOString().slice(0, 10)
          )
        )
      )
    )
    .then((transactions) =>
      [].concat(
        ...transactions.map((transactionList) => transactionList.transactions)
      )
    )
    .then((transactions) =>
      BudgetTransaction.importTransactions(req.userId, transactions)
    );

  return res.status(200).json({ result: transactionImportResult.length });
};

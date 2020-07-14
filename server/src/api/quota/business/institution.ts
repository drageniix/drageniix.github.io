import express from "express";
import { CustomRequest } from "../../../middleware/express";
import {
  BudgetAccountController,
  BudgetInstitutionController,
} from "../controllers";
import {
  exchangePlaidAccessTokenForItem,
  exchangePlaidPublicToken,
} from "../gateway/plaid";

// requires req.body.token from plaid
export const createInstituition = async (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> => {
  const { access_token: accessToken } = await exchangePlaidPublicToken(
    req.body.token
  );

  const {
    itemId,
    institutionName,
    accounts,
  } = await exchangePlaidAccessTokenForItem(accessToken);

  const institution = await BudgetInstitutionController.createAndPostInstitution(
    {
      name: institutionName,
      plaidItemId: itemId,
      plaidAccessToken: accessToken,
      userId: req.userId,
    }
  );

  const createdAccounts = await BudgetAccountController.createAccountsFromInstitution(
    institution,
    accounts
  ).then((accounts) => BudgetAccountController.postAccounts(accounts));

  const response = {
    ...institution.getDisplayFormat(),
    accounts: createdAccounts.map((account) => account.getDisplayFormat()),
  };

  return res.status(200).json(response);
};

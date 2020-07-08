import express from "express";
import { CustomRequest } from "../../../middleware/express";
import plaid from "../../../middleware/plaid";
import { CollectionTypes } from "../middleware/firebase";
import BudgetAccount from "../models/Account";
import BudgetInstitution from "../models/Instituition";
import User from "../models/User";

export const createInstituition = async (
  req: CustomRequest,
  res: express.Response
) => {
  const {
    access_token,
    item_id,
  } = await plaid.getPlaidClient().exchangePublicToken(req.body.token);

  const userId = User.getUserReferenceById(req.userId);

  const {
    item: { institution_id },
    accounts,
  } = await plaid.getPlaidClient().getAccounts(access_token);

  const {
    institution: { name },
  } = await plaid.getPlaidClient().getInstitutionById(institution_id);

  const institution = await new BudgetInstitution({
    explicit: {
      name,
      plaidItemId: item_id,
      plaidAccessToken: access_token,
    },
  }).post(userId.collection(CollectionTypes.INSTITUTION));

  await Promise.all(
    accounts.map((account) =>
      new BudgetAccount({
        explicit: {
          name: account.name,
          originalName: account.official_name,
          availableBalance: account.balances.available,
          currentBalance: account.balances.current,
          startingBalance: account.balances.current,
          type: account.type,
          subtype: account.subtype,
          plaidAccountId: account.account_id,
        },
      }).post(institution.id.collection(CollectionTypes.ACCOUNTS))
    )
  );

  return res.status(200).json(institution.getFormattedResponse());
};

// update
// export const getItem = async (req: express.Request, res: express.Response) => {
//   let response: any;

//   const startDate = req.query.startDate as string;
//   const endDate =
//     (req.query.endDate as string) || new Date().toISOString().slice(0, 10);

//   if (startDate) {
//     response = await plaid
//       .getPlaidClient()
//       .getTransactions(req.query.token as string, startDate, endDate); // access token
//   } else {
//     response = await plaid
//       .getPlaidClient()
//       .getAccounts(req.query.token as string);
//   }
//   return res.status(200).json(response);
// };

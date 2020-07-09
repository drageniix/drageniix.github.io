import express from "express";
import { CustomRequest } from "../../../middleware/express";
import { exchangePublicTokenForItem } from "../middleware/plaid";
import BudgetInstitution from "../models/Instituition";

export const createInstituition = async (
  req: CustomRequest,
  res: express.Response
) => {
  const {
    item_id,
    access_token,
    institution_name,
    accounts,
    transactions,
  } = await exchangePublicTokenForItem(req.body.token);

  const institution = await new BudgetInstitution({
    explicit: {
      name: institution_name,
      plaidItemId: item_id,
      plaidAccessToken: access_token,
      userId: req.userId,
    },
  }).post({ accounts, transactions });

  return res.status(200).json(institution.getFormattedResponse());
};

// update
// export const getItem = async (CustomRequest, res: express.Response) => {
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

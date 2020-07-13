import express from "express";
import { CustomRequest } from "../../../middleware/express";
import { BudgetInstitutionController } from "../controllers";
import { exchangePlaidPublicTokenForItem } from "../middleware/plaid";

export const createInstituition = async (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> => {
  const {
    itemId,
    accessToken,
    institutionName,
    accounts,
  } = await exchangePlaidPublicTokenForItem(req.body.token);

  const institution = await BudgetInstitutionController.createAndPostInstitution(
    {
      name: institutionName,
      plaidItemId: itemId,
      plaidAccessToken: accessToken,
      userId: req.userId,
    }
  );

  await BudgetInstitutionController.createAccountsFromInstitution(institution, {
    accounts,
  });

  return res.status(200).json(institution.getDisplayFormat());
};

// export const importTransactions = async (
//   req: CustomRequest,
//   res: express.Response
// ): Promise<express.Response> => {
//   const transactionImportResult = await BudgetInstitutionController.getAllInstitutions(
//     req.userId
//   )
//     .then((institutions) =>
//       Promise.all(
//         institutions.map((institution) =>
//           getPlaidTransactions(
//             institution.plaidAccessToken,
//             institution.updatedAt.toISOString().slice(0, 10)
//           )
//         )
//       )
//     )
//     .then((transactions) =>
//       [].concat(
//         ...transactions.map((transactionList) => transactionList.transactions)
//       )
//     )
//     .then((transactions) =>
//       BudgetTransaction.importTransactions(req.userId, transactions)
//     );

//   return res.status(200).json({ result: transactionImportResult.length });
// };

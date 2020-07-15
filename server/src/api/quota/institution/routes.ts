import express from "express";
import * as BudgetInstitutionController from ".";
import { asyncWrapper, CustomRequest } from "../../../middleware/express";
import {
  exchangePlaidAccessTokenForItem,
  exchangePlaidPublicToken,
} from "../../gateway/plaid";
import { isAuth } from "../validations/common";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isAuth,
  asyncWrapper(
    async (
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

      return res.status(200).json({
        ...institution.getDisplayFormat(),
        accounts: accounts.map((account) => ({
          accountId: account.account_id,
          name: account.official_name,
          type: account.type,
          subtype: account.subtype,
        })),
      });
    }
  )
);

export default router;
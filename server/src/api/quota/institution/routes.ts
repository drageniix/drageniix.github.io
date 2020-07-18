import express from "express";
import * as BudgetInstitutionController from ".";
import { asyncWrapper, CustomRequest } from "../gateway/express";
import {
  exchangePlaidAccessTokenForItem,
  exchangePlaidPublicToken,
} from "../gateway/plaid";
import { isAuth } from "../validations/common";

export const router = express.Router({ mergeParams: true });

// should only be one
router.post(
  "/default",
  isAuth,
  asyncWrapper(
    async (
      req: CustomRequest,
      res: express.Response
    ): Promise<express.Response> => {
      const institution = await BudgetInstitutionController.createAndPostInstitution(
        {
          name: (req.query.name as string) || "Manual Entry",
          userId: req.userId,
        }
      );

      return res.status(200).json({
        ...institution.getDisplayFormat(),
      });
    }
  )
);

router.post(
  "/import",
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

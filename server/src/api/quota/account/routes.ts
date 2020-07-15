import express from "express";
import * as BudgetAccountController from ".";
import { asyncWrapper, CustomRequest } from "../../../middleware/express";
import { getPlaidAccounts } from "../../gateway/plaid";
import * as BudgetInstitutionController from "../institution";
import { isAuth } from "../validations/common";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetAccountController.getAllAccounts(req.userId, {
        institutionRef: req.params.institutionId,
      }).then((accounts) =>
        res
          .status(200)
          .json(accounts.map((account) => account.getDisplayFormat()))
      )
  )
);

router.post(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetAccountController.createAndPostAccount({
        ...req.body,
        userId: req.userId,
      })
        .then((account) => BudgetAccountController.createMatchingPayee(account))
        .then(({ account }) => res.status(200).json(account.getDisplayFormat()))
  )
);

router.post(
  "/populate",
  isAuth,
  asyncWrapper(
    async (
      req: CustomRequest,
      res: express.Response
    ): Promise<express.Response> => {
      const institution = await BudgetInstitutionController.getInstitution(
        req.userId,
        req.body.institutionId
      );

      const { accounts } = await getPlaidAccounts(institution.plaidAccessToken);

      return BudgetAccountController.createAccountsFromInstitution(
        institution,
        accounts.filter(
          (account) =>
            !req.body.accounts ||
            (req.body.accounts as string[]).includes(account.account_id)
        )
      )
        .then((accounts) => BudgetAccountController.postAccounts(accounts))
        .then((accounts) =>
          res
            .status(200)
            .json(accounts.map((account) => account.getDisplayFormat()))
        );
    }
  )
);

router.get(
  "/:accountId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetAccountController.getAccount(req.userId, {
        accountRef: req.params.accountId,
      }).then((account) => res.status(200).json(account.getDisplayFormat()))
  )
);

router.put(
  "/:accountId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetAccountController.getAccount(req.userId, {
        accountRef: req.params.accountId,
      })
        .then((account) =>
          req.body.name && req.body.name !== account.name
            ? BudgetAccountController.updateAccount(account, {
                name: req.body.name,
              }).then((account) =>
                BudgetAccountController.updateLinkedAccountName(account)
              )
            : account
        )
        .then((account) => res.status(200).json(account.getDisplayFormat()))
  )
);

export default router;
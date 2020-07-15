import express from "express";
import * as BudgetPayeeController from ".";
import { asyncWrapper, CustomRequest } from "../../../middleware/express";
import { isAuth } from "../validations/common";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetPayeeController.getAllPayees(req.userId).then((payees) =>
        res.status(200).json(payees.map((payee) => payee.getDisplayFormat()))
      )
  )
);

router.post(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetPayeeController.createAndPostPayee({
        ...req.body,
        userId: req.userId,
      }).then((payee) => res.status(200).json(payee.getDisplayFormat()))
  )
);

router.get(
  "/:payeeId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetPayeeController.getPayee(req.userId, {
        payeeRef: req.params.payeeId,
      }).then((payee) => res.status(200).json(payee.getDisplayFormat()))
  )
);

router.put(
  "/:payeeId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetPayeeController.getPayee(req.userId, {
        payeeRef: req.params.payeeId,
      })
        .then((payee) =>
          req.body.name && req.body.name !== payee.name
            ? BudgetPayeeController.updatePayee(payee, {
                name: req.body.name,
              }).then((payee) =>
                BudgetPayeeController.updateLinkedPayeeName(payee)
              )
            : payee
        )
        .then((payee) => res.status(200).json(payee.getDisplayFormat()))
  )
);

export default router;

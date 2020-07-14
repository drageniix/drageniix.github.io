import express from "express";
import { CustomRequest } from "../../../middleware/express";
import { BudgetPayeeController } from "../controllers";

export const getPayees = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetPayeeController.getAllPayees(req.userId).then((payees) =>
    res.status(200).json(payees.map((payee) => payee.getDisplayFormat()))
  );

export const postPayee = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetPayeeController.createAndPostPayee({
    ...req.body,
    userId: req.userId,
  }).then((payee) => res.status(200).json(payee.getDisplayFormat()));

export const getPayee = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetPayeeController.getPayee(req.userId, {
    payeeRef: req.params.payeeId,
  }).then((payee) => res.status(200).json(payee.getDisplayFormat()));

// req.body.name is the only valid update
export const putPayee = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetPayeeController.getPayee(req.userId, { payeeRef: req.params.payeeId })
    .then((payee) =>
      req.body.name && req.body.name !== payee.name
        ? BudgetPayeeController.updatePayee(payee, {
            name: req.body.name,
          }).then((payee) => BudgetPayeeController.updateLinkedPayeeName(payee))
        : payee
    )
    .then((payee) => res.status(200).json(payee.getDisplayFormat()));

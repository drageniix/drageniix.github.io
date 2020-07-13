import express from "express";
import { CustomRequest } from "../../../middleware/express";
import { BudgePayeeController } from "../controllers";

export const getPayees = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgePayeeController.getAllPayees(req.userId).then((payees) =>
    res.status(200).json(payees.map((payee) => payee.getDisplayFormat()))
  );

export const postPayee = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgePayeeController.createAndPostPayee({
    ...req.body,
    userId: req.userId,
  }).then((payee) => res.status(200).json(payee.getDisplayFormat()));

export const getPayee = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgePayeeController.getPayee(req.userId, {
    payeeRef: req.params.payeeId,
  }).then((payee) => res.status(200).json(payee.getDisplayFormat()));

export const putPayee = (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgePayeeController.getPayee(req.userId, { payeeRef: req.params.payeeId })
    .then((payee) =>
      BudgePayeeController.updatePayee(payee, { name: req.body.name })
    )
    .then((payee) => res.status(200).json(payee.getDisplayFormat()));

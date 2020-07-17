import express from "express";
import * as BudgetScheduledController from ".";
import { asyncWrapper, CustomRequest } from "../gateway/express";
import { isAuth } from "../validations/common";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetScheduledController.getAllScheduleds(req.userId, {
        accountId: req.query.accountId as string,
        payeeId: req.query.payeeId as string,
        categoryId: req.query.categoryId as string,
        flagColor: req.query.flagColor as string,
        scheduledUntil: req.query.date && new Date(req.query.date as string),
      }).then((scheduleds) =>
        res.status(200).json({
          scheduleds: scheduleds.map((scheduled) =>
            scheduled.getDisplayFormat()
          ),
        })
      )
  )
);

router.post(
  "/",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetScheduledController.addManualScheduledTransaction(req.userId, {
        accountId: req.body.accountId,
        payeeId: req.body.payeeId,
        categoryId: req.body.categoryId,
        amount: req.body.amount,
        date: req.body.date,
        note: req.body.note,
        flagColor: req.body.flagColor,
        frequency: req.body.frequency,
      })
        .then((scheduled) => BudgetScheduledController.postScheduled(scheduled))
        .then((scheduled) => res.status(200).json(scheduled.getDisplayFormat()))
  )
);

router.get(
  "/:scheduledId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetScheduledController.getScheduled(
        req.userId,
        req.params.scheduledId
      ).then((scheduled) => res.status(200).json(scheduled.getDisplayFormat()))
  )
);

router.put(
  "/:scheduledId",
  isAuth,
  asyncWrapper(
    (req: CustomRequest, res: express.Response): Promise<express.Response> =>
      BudgetScheduledController.getScheduled(req.userId, req.params.scheduledId)
        .then((scheduled) =>
          BudgetScheduledController.updateScheduled(scheduled, {
            amount: req.body.amount,
            date: req.body.date,
            note: req.body.note,
            flagColor: req.body.flagColor,
            frequency: req.body.frequency,
          })
        )
        .then((scheduled) => res.status(200).json(scheduled.getDisplayFormat()))
  )
);

export default router;

import express from "express";
import * as BudgetUserController from ".";
import { asyncWrapper, CustomRequest } from "../gateway/express";
import { validateLogin, validateSignup } from "./validations";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  validateSignup,
  asyncWrapper(
    async (
      req: CustomRequest,
      res: express.Response
    ): Promise<express.Response> => {
      const { email, name, password: rawPassword } = req.body;
      const password = await BudgetUserController.hashPassword(rawPassword);

      const user = await BudgetUserController.createAndPostUser({
        email,
        password,
        name,
      });

      const response = BudgetUserController.initiateLogin(user);
      return res.status(201).json(response);
    }
  )
);

router.post(
  "/login",
  validateLogin,
  asyncWrapper(
    async (
      req: CustomRequest,
      res: express.Response
    ): Promise<express.Response> =>
      BudgetUserController.getUser({ email: req.body.email }).then((user) =>
        res.status(200).json(BudgetUserController.initiateLogin(user))
      )
  )
);

export default router;

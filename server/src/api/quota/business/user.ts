import express from "express";
import { CustomRequest } from "../../../middleware/express";
import { BudgetUserController } from "../controllers";

export const signup = async (
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
};

export const login = async (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetUserController.getUserByEmail(req.body.email).then((user) =>
    res.status(200).json(BudgetUserController.initiateLogin(user))
  );

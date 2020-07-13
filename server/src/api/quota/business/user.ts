import express from "express";
import { CustomRequest } from "../../../middleware/express";
import { BudgetUserController } from "../controllers";

export const signup = async (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> => {
  const { email, name, password } = req.body;
  const hashedPassword = await BudgetUserController.hashPassword(password);

  const user = await BudgetUserController.createAndPostUser({
    email,
    password: hashedPassword,
    name,
  });

  const response = BudgetUserController.initiateLogin(user);
  return res.status(201).json(response);
};

export const login = async (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetUserController.getUserByEmail(req.body.email).then((user) => {
    const response = BudgetUserController.initiateLogin(user);
    return res.status(200).json(response);
  });

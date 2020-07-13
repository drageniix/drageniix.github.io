import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../../../middleware/express";
import { BudgetUserController } from "../controllers";
import BudgetUser from "../models/User";

const initiateLogin = (user: BudgetUser): { token: string } => ({
  token: jwt.sign(
    {
      privilege: user.privilege,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h", subject: user.id.id }
  ),
});

export const signup = async (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> => {
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await BudgetUserController.createAndPostUser({
    email,
    password: hashedPassword,
    name,
  });

  const response = initiateLogin(user);
  return res.status(201).json(response);
};

export const login = async (
  req: CustomRequest,
  res: express.Response
): Promise<express.Response> =>
  BudgetUserController.getUserByEmail(req.body.email).then((user) => {
    const response = initiateLogin(user);
    return res.status(200).json(response);
  });

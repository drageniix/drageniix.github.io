import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../../../middleware/express";
import User from "../models/User";

export const signup = async (req: CustomRequest, res: express.Response) => {
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await new User({
    explicit: {
      email,
      password: hashedPassword,
      name,
    },
  }).post();

  const response = initiateLogin(user);
  return res.status(201).json(response);
};

export const login = async (req: CustomRequest, res: express.Response) =>
  User.getUserByEmail(req.body.email).then((user) => {
    const response = initiateLogin(user);
    res.status(200).json(response);
  });

const initiateLogin = (user: User) => ({
  token: jwt.sign(
    {
      privilege: user.privilege,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h", subject: user.id.id }
  ),
});

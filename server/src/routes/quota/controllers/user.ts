import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const signup = async (req: express.Request, res: express.Response) => {
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  return new User({
    explicit: {
      email,
      password: hashedPassword,
      name,
    },
  })
    .post()
    .then((user) => {
      const response = initiateLogin(user);
      return res.status(201).json(response);
    });
};

export const login = async (req: express.Request, res: express.Response) =>
  User.getUserByEmail(req.body.email).then((user) => {
    const response = initiateLogin(user);
    res.status(200).json(response);
  });

const initiateLogin = (user: User) => ({
  token: jwt.sign(
    {
      sub: user.id.id,
      privilege: user.privilege,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  ),
});

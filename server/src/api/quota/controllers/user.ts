import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BudgetUser } from "../models";
import { BudgetUserPersistence } from "../persistence";

const {
  createUser,
  createAndPostUser,
  postUser,
  updateUser,
  getUserByEmail,
  getUserById,
  getUserReferenceById,
} = BudgetUserPersistence;

export const initiateLogin = (user: BudgetUser): { token: string } => ({
  token: jwt.sign(
    {
      privilege: user.privilege,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h", subject: user.id.id }
  ),
});

export const hashPassword = async (password: string): Promise<string> =>
  bcrypt.hash(password, 12);

export {
  BudgetUser,
  createUser,
  createAndPostUser,
  postUser,
  updateUser,
  getUserByEmail,
  getUserById,
  getUserReferenceById,
};

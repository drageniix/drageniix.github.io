import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BudgetUser } from ".";

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

import bcrypt from "bcryptjs";
import { body } from "express-validator";
import * as BudgetUserController from ".";
import { inputValidation } from "../validations/common";

export const validateSignup = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email.")
    .custom((email) =>
      BudgetUserController.getUser({ email }).then((user) => {
        if (user) {
          throw new Error("A user with this email already exists.");
        }
      })
    ),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters."),
  body("confirm_password").custom((confirmedPassword, { req }) => {
    if (confirmedPassword !== req.body.password) {
      throw new Error("Passwords don't match.");
    } else return true;
  }),
  inputValidation,
];

export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email.")
    .custom((email, { req }) =>
      BudgetUserController.getUser({ email }).then((user) => {
        if (!user) {
          throw new Error("A user with this email could not be found.");
        } else {
          req.loginAttemptPW = user.password;
        }
      })
    ),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters")
    .custom(async (password, { req: { loginAttemptPW } }) => {
      if (loginAttemptPW && !(await bcrypt.compare(password, loginAttemptPW))) {
        throw new Error("Incorrect email or password.");
      }
    }),
  inputValidation,
];

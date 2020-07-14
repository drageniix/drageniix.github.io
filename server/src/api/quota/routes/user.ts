import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as userControllers from "../business/user";
import { validateLogin, validateSignup } from "../validations/user";

const router = express.Router({ mergeParams: true });

router.post("/", validateSignup, asyncWrapper(userControllers.signup));

router.post("/login", validateLogin, asyncWrapper(userControllers.login));

export default router;

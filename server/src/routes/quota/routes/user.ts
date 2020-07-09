import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as userControllers from "../controllers/user";
import { validateLogin, validateSignup } from "../middleware/user";

const router = express.Router({ mergeParams: true });

router.post("/", validateSignup, asyncWrapper(userControllers.signup));

router.post("/login", validateLogin, asyncWrapper(userControllers.login));

export default router;

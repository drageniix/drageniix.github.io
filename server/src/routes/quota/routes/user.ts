import express from "express";
import { asyncWrapper } from "../../../middleware/express";
import * as userControllesr from "../controllers/user";
import { validateLogin, validateSignup } from "../middleware/user";

const router = express.Router({ mergeParams: true });

router.post("/signup", validateSignup, asyncWrapper(userControllesr.signup));

router.post("/login", validateLogin, asyncWrapper(userControllesr.login));

export default router;

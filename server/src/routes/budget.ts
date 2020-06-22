import express from "express";
import { getPaycheck, getRaw } from "../controllers/budget";

const router = express.Router();

router.get("/raw", getRaw);
router.get("/paycheck", getPaycheck);

export default router;

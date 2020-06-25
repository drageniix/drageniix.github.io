import express from "express";
import * as monthControllers from "../controllers/months";

const router = express.Router({ mergeParams: true });

router.get("/", monthControllers.getMonths);

router.post("/", monthControllers.postMonth);

router.get("/:monthId", monthControllers.getMonth);

export default router;

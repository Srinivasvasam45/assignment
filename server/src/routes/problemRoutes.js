import { Router } from "express";
import { listProblems, getProblem } from "../controllers/problemController.js";

const router = Router();
router.get("/", listProblems);
router.get("/:id", getProblem);

export default router;

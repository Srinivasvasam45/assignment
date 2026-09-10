import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  startAttempt,
  listAttempts,
  getAttempt,
  submitAttempt,
} from "../controllers/attemptController.js";

const router = Router();
router.use(requireAuth);

router.post("/", startAttempt);
router.get("/", listAttempts); // history: GET /api/attempts?problemId=...
router.get("/:id", getAttempt); // also used for polling evaluation status
router.post("/:id/submissions", submitAttempt);

export default router;

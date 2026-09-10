import Attempt from "../models/Attempt.js";
import Problem from "../models/Problem.js";
import { getEvaluator } from "../services/evaluatorService.js";

export async function startAttempt(req, res) {
  const { problemId } = req.body;
  const problem = await Problem.findById(problemId);
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  const attempt = await Attempt.create({
    userId: req.userId,
    problemId,
    status: "InProgress",
  });

  res.status(201).json(attempt);
}

// History: all of this learner's attempts, optionally filtered by problem.
export async function listAttempts(req, res) {
  const filter = { userId: req.userId };
  if (req.query.problemId) filter.problemId = req.query.problemId;

  const attempts = await Attempt.find(filter).populate("problemId", "title slug").sort("-createdAt");
  res.json(attempts);
}

export async function getAttempt(req, res) {
  const attempt = await Attempt.findOne({ _id: req.params.id, userId: req.userId }).populate(
    "problemId"
  );
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });
  res.json(attempt);
}

// Submit a solution for an attempt. Per the brief's own guidance: store
// the submission immediately, THEN kick off evaluation without blocking
// the response. Returns instantly with status "Pending" - the client
// polls GET /attempts/:id (or a dedicated evaluation endpoint) for the
// result.
export async function submitAttempt(req, res) {
  const { format, content, language } = req.body;

  const attempt = await Attempt.findOne({ _id: req.params.id, userId: req.userId }).populate(
    "problemId"
  );
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });

  // Duplicate-submission guard: one attempt = one submission. A retry
  // must start a new Attempt via POST /attempts instead.
  if (attempt.submission) {
    return res.status(409).json({ error: "This attempt already has a submission. Start a new attempt to retry." });
  }
  if (!format || !content) {
    return res.status(400).json({ error: "format and content are required" });
  }

  attempt.submission = { format, content, language, submittedAt: new Date() };
  attempt.status = "Submitted";
  attempt.evaluation = { status: "Pending", feedbackItems: [] };
  await attempt.save();

  // Fire-and-forget: do not await this inside the request/response cycle.
  runEvaluation(attempt._id).catch((err) => {
    console.error(`Evaluation crashed for attempt ${attempt._id}:`, err);
  });

  res.status(202).json({
    attemptId: attempt._id,
    status: attempt.evaluation.status,
    message: "Submission received. Poll GET /api/attempts/:id for evaluation status.",
  });
}

// Background evaluation runner. Kept as a plain async function (no queue
// library) since a single Gemini call per submission is well within
// "simple monolith" scope for this assignment. If this needed to scale
// past a handful of concurrent evaluations, the first thing to extract
// would be exactly this function into a worker process reading from a
// lightweight job table/queue - the Attempt/Evaluation schema would not
// need to change at all.
async function runEvaluation(attemptId) {
  const attempt = await Attempt.findById(attemptId).populate("problemId");
  if (!attempt) return;

  attempt.evaluation.status = "Evaluating";
  await attempt.save();

  try {
    const evaluator = getEvaluator();
    const result = await evaluator.evaluate({
      problem: attempt.problemId,
      submission: attempt.submission,
    });

    attempt.evaluation.status = "Completed";
    attempt.evaluation.overallSummary = result.overallSummary;
    attempt.evaluation.feedbackItems = result.feedbackItems;
    attempt.evaluation.evaluatedAt = new Date();
  } catch (err) {
    attempt.evaluation.status = "Failed";
    attempt.evaluation.errorMessage = err.message || "Evaluation failed";
  }

  await attempt.save();
}

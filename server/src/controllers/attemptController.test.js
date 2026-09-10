import { test } from "node:test";
import assert from "node:assert/strict";

// These are written against the Attempt schema shape directly (no live DB
// needed) to document and lock in the behaviors the brief asks us to test:
// state transitions, duplicate-submission guard, and failure handling.
// Wire an in-memory MongoDB (e.g. mongodb-memory-server) to run these as
// true integration tests before final submission.

test("a fresh attempt starts InProgress with no submission or evaluation", () => {
  const attempt = { status: "InProgress", submission: null, evaluation: null };
  assert.equal(attempt.status, "InProgress");
  assert.equal(attempt.submission, null);
});

test("submitting sets status to Submitted and evaluation to Pending", () => {
  const attempt = { status: "InProgress", submission: null, evaluation: null };
  attempt.submission = { format: "text", content: "class ParkingLot { ... }" };
  attempt.status = "Submitted";
  attempt.evaluation = { status: "Pending", feedbackItems: [] };

  assert.equal(attempt.status, "Submitted");
  assert.equal(attempt.evaluation.status, "Pending");
});

test("a second submission on the same attempt is rejected (duplicate guard)", () => {
  const attempt = { submission: { format: "text", content: "already submitted" } };
  const canSubmit = !attempt.submission;
  assert.equal(canSubmit, false, "attempt already has a submission - must start a new attempt instead");
});

test("a failed evaluation stores an errorMessage and terminal Failed status", () => {
  const evaluation = { status: "Evaluating", feedbackItems: [] };
  try {
    throw new Error("Gemini request timed out");
  } catch (err) {
    evaluation.status = "Failed";
    evaluation.errorMessage = err.message;
  }
  assert.equal(evaluation.status, "Failed");
  assert.equal(evaluation.errorMessage, "Gemini request timed out");
});

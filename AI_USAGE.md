# AI_USAGE.md

I used Claude throughout this assignment for design discussion and
scaffolding. Below are the meaningful decisions where AI input mattered,
what I did with it, and why.

## 1. Async vs. blocking evaluation

**AI suggested:** Two options — block the submit request until Gemini
responds, or return immediately and let the client poll a status endpoint.

**I accepted:** The polling approach, because the assignment's own
candidate guide explicitly says not to block the main submission request
and to give evaluation a clear state machine (Pending → Evaluating →
Completed/Failed). This wasn't a stylistic choice — it was directly
specified, so I went with it over the simpler blocking version.

## 2. Attempt/Submission/Evaluation as separate concerns

**AI suggested:** Modeling `Attempt`, `Submission`, and `Evaluation` as
distinct entities (embedded as sub-documents in one `Attempt` document for
MongoDB simplicity) rather than one flat "Attempt" object with a status
field.

**I accepted:** This, because it directly satisfies the two "change
tests" in the brief — adding a new submission format only touches
`Submission.format`, and adding a new evaluator only touches `Evaluation`,
without either change rippling into the practice-loop code.

## 3. Evaluator interface / strategy pattern

**AI suggested:** Wrapping the Gemini call behind an `Evaluator` base
class with a factory function (`getEvaluator()`), rather than calling the
Gemini SDK directly from the controller.

**I accepted:** This adds a small amount of indirection for a 2-day MVP,
but it's exactly what the brief asks for under "extensibility &
engineering judgement" — a future rule-based or human-review evaluator
plugs in without touching `attemptController.js`.

## 4. Rubric structure and prompt design

**AI suggested:** A fixed 8-dimension rubric (requirement understanding,
class responsibilities, coupling/cohesion, etc.) with a forced JSON
response shape (`criterion → score → evidence → concern → suggestion`)
instead of an open-ended "rate this design" prompt.

**I accepted:** This as-is. The brief explicitly warns against unconstrained
scoring prompts, so I kept the rubric fixed and required evidence per
criterion rather than a bare number.

## 5. [Fill in during your own implementation]

Use this slot for a decision you made yourself while wiring things up —
e.g., a bug the AI's suggested code had that you caught and fixed, a
naming choice you changed, or a piece of AI-generated code you rejected
and rewrote. Being specific here (not generic) is what this section is
actually evaluated on.

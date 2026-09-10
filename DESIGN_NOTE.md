# Design Note

## MVP scope

3 problems (Parking Lot, Elevator, Vending Machine), two submission
formats (text design write-up, or code), one AI-backed evaluator scoring
against a fixed 8-dimension rubric, and full attempt history per learner.
Deliberately excluded: diagram submissions, multiple evaluator types,
deployment at scale — all accommodated by the design but not built, per
the assignment's scope boundary (LLD focus, not HLD).

## User flow

Login/Register → browse Problems → open a Problem → **Start Attempt** →
choose format (text/code) and write a solution → **Submit** (returns
immediately, status `Pending`) → client polls until evaluation is
`Completed`/`Failed` → review rubric-based feedback → optionally start a
**new** Attempt on the same problem to retry.

## Domain model

- `User` — identity/auth only.
- `Problem` — static definition (title, description, requirements).
- `Attempt` — one practice session; owns at most one `Submission` and its
  resulting `Evaluation`. A retry is a new `Attempt`, not an edit — this
  is what gives free attempt history.
- `Submission` — `{ format: 'text'|'code', content, language? }`. The
  `format` field is the sole discriminator; adding `'diagram'` later needs
  no other schema change.
- `Evaluation` — lifecycle (`Pending → Evaluating → Completed/Failed`) plus
  `overallSummary` and a list of `FeedbackItem`s. `evaluatorType` records
  which evaluator produced the result.
- `FeedbackItem` — `{ criterion, score (1-5), evidence, concern, suggestion }`
  per rubric dimension.

## Evaluation approach

Evaluation is behind an `Evaluator` interface. The current implementation,
`GeminiEvaluator`, sends the problem requirements and the learner's
submission with a **fixed rubric and forced structured JSON output** — the
model is never asked an open-ended "is this good?" question, which the
assignment's own guide flags as a weak approach. Deterministic checks
(non-empty content, one-submission-per-attempt) run before the AI call;
everything judgment-based (responsibility quality, coupling/cohesion,
abstraction use, extensibility) is scored by the AI, each score tied to
cited evidence from the actual submission.

## Handling time/failure in evaluation

Per the assignment's explicit guidance not to block the submission
request: `POST /attempts/:id/submissions` saves the submission and returns
`202 Pending` immediately. Evaluation then runs as a background async
function, updating status to `Evaluating`, then `Completed` or `Failed`
(with an `errorMessage`) on the same `Attempt` document. The client polls
`GET /attempts/:id`. No queue or worker process was needed at this scale —
if load grew, the background function is the one piece that would move
into a separate worker, without any schema change.

## Key trade-offs

- **Embedding vs. normalizing:** Submission and Evaluation are embedded in
  the Attempt document (not separate collections) since the relationship
  is strictly 1–1–1 for this MVP. This trades some normalization purity
  for fewer queries and total scope simplicity, appropriate for a 2-day
  monolith.
- **No code execution:** Code submissions are evaluated by the LLM reading
  the code, not compiled/run — building a sandboxed execution environment
  was judged out of scope for the time available and secondary to the
  actual grading focus (design quality, not runtime correctness).
- **Single evaluator, pluggable by design:** Only `GeminiEvaluator` exists
  today. The interface exists specifically so a rule-based or
  human-reviewed evaluator could be added later without touching the
  Attempt/Submission flow — validated against the assignment's two
  explicit "change tests."

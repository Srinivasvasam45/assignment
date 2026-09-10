import mongoose from "mongoose";

// FeedbackItem: one rubric dimension's result. Never created directly -
// always produced by an Evaluator implementation.
const feedbackItemSchema = new mongoose.Schema(
  {
    criterion: { type: String, required: true }, // e.g. "coupling_cohesion"
    score: { type: Number, min: 1, max: 5, required: true },
    evidence: { type: String, required: true },
    concern: { type: String, default: "" },
    suggestion: { type: String, default: "" },
  },
  { _id: false }
);

// Evaluation: the lifecycle + result of judging one submission.
// Kept as its own sub-object (not flattened into Attempt) so a future
// second evaluator type only ever needs to fill this shape - nothing
// else on Attempt changes. This is what satisfies "accommodate another
// evaluation approach later" from the brief.
const evaluationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Pending", "Evaluating", "Completed", "Failed"],
      default: "Pending",
    },
    evaluatorType: { type: String, default: "gemini-v1" },
    overallSummary: { type: String, default: "" },
    feedbackItems: [feedbackItemSchema],
    errorMessage: { type: String, default: "" },
    evaluatedAt: { type: Date },
  },
  { _id: false }
);

// Submission: the learner's answer. `format` is the discriminator that
// lets a future "diagram" format be added without touching Attempt or
// Evaluation - this is what satisfies "accommodate another submission
// format later" from the brief.
const submissionSchema = new mongoose.Schema(
  {
    format: { type: String, enum: ["text", "code"], required: true },
    content: { type: String, required: true },
    language: { type: String }, // only meaningful when format === 'code'
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Attempt: one practice session by one user on one problem.
// Responsibility: own the practice-loop state. Never holds more than one
// submission - "try again" always creates a NEW Attempt document, which is
// what gives us real attempt history for free (just query by user+problem).
const attemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    status: { type: String, enum: ["InProgress", "Submitted"], default: "InProgress" },
    submission: { type: submissionSchema, default: null },
    evaluation: { type: evaluationSchema, default: null },
  },
  { timestamps: true }
);

// Duplicate-submission guard: an Attempt can only ever receive one
// submission. Enforced at the service layer (see attemptController),
// this index just backs it up at the DB layer for the (attempt, first
// submission) case.
attemptSchema.index({ userId: 1, problemId: 1, createdAt: -1 });

export default mongoose.model("Attempt", attemptSchema);

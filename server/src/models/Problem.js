import mongoose from "mongoose";

// Responsibility: static definition of an LLD problem. Immutable from the
// learner's point of view - never mutated by attempts/evaluations.
const problemSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // e.g. "parking-lot"
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    description: { type: String, required: true },
    requirements: [{ type: String, required: true }], // bullet list shown to learner
  },
  { timestamps: true }
);

export default mongoose.model("Problem", problemSchema);

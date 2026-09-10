import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Responsibility: represent a learner's identity and credentials only.
// It does NOT know about attempts, submissions, or evaluation - that
// separation is what lets Attempt evolve independently of auth.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hash(plainPassword, 10);
};

export default mongoose.model("User", userSchema);

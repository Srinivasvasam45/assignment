import { GoogleGenerativeAI } from "@google/generative-ai";

// The fixed rubric. Every evaluator implementation scores against the
// SAME dimensions, so swapping evaluators later never changes what the
// frontend renders - only how the score/evidence was produced.
export const RUBRIC_CRITERIA = [
  "requirement_understanding",
  "class_responsibilities",
  "coupling_cohesion",
  "encapsulation_interfaces",
  "abstraction_and_patterns",
  "extensibility",
  "edge_cases_and_testability",
  "explanation_quality",
];

// Evaluator "interface": any evaluator (Gemini-backed, rule-based, human-
// review-backed, whatever comes later) must implement `evaluate()` and
// return this exact shape. Attempt/Submission code never needs to know
// which evaluator ran - it only depends on this contract.
class Evaluator {
  // eslint-disable-next-line no-unused-vars
  async evaluate({ problem, submission }) {
    throw new Error("evaluate() must be implemented by a subclass");
  }
}

// Free-tier evaluator using Google's Gemini API (no credit card required -
// get a key at aistudio.google.com/apikey). Chosen over other free options
// because it supports forced-JSON output natively, which the fixed-rubric
// prompt below depends on.
export class GeminiEvaluator extends Evaluator {
  constructor() {
    super();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: { responseMimeType: "application/json" },
      systemInstruction:
        "You are an LLD (Low-Level Design) interviewer. Score the candidate's " +
        "submission strictly against the given rubric. Always cite concrete " +
        "evidence from their submission - never give a bare number.",
    });
  }

  async evaluate({ problem, submission }) {
    // Deliberately structured + constrained prompt - never an open
    // "is this a good design?" question. Forces one JSON object with a
    // fixed key per rubric criterion, matching FeedbackItem exactly.
    const prompt = buildPrompt({ problem, submission });

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return normalizeResult(parsed);
  }
}

function buildPrompt({ problem, submission }) {
  return `
Problem: ${problem.title}
Requirements:
${problem.requirements.map((r) => `- ${r}`).join("\n")}

Candidate submission (format: ${submission.format}${submission.language ? `, language: ${submission.language}` : ""}):
"""
${submission.content}
"""

Score the submission on each of these criteria: ${RUBRIC_CRITERIA.join(", ")}.
Respond ONLY with a JSON object of this exact shape:
{
  "overallSummary": string,
  "feedbackItems": [
    { "criterion": string, "score": number (1-5), "evidence": string, "concern": string, "suggestion": string }
  ]
}
Include one feedbackItem per criterion listed above, in that order.
`.trim();
}

function normalizeResult(parsed) {
  return {
    overallSummary: parsed.overallSummary || "",
    feedbackItems: (parsed.feedbackItems || []).map((item) => ({
      criterion: item.criterion,
      score: Math.max(1, Math.min(5, Number(item.score) || 1)),
      evidence: item.evidence || "",
      concern: item.concern || "",
      suggestion: item.suggestion || "",
    })),
  };
}

// Factory - this single line is what you'd change to swap evaluators
// (e.g. back to an OpenAIEvaluator, or a future RuleBasedEvaluator).
export function getEvaluator() {
  return new GeminiEvaluator();
}

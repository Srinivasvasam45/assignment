import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, CircleCheck, CircleX } from "lucide-react";
import { api } from "../api/client.js";
import {
  DifficultyTag,
  Button,
  Panel,
  ScoreBar,
} from "../components/ui.jsx";

const TERMINAL_STATUSES = ["Completed", "Failed"];

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [format, setFormat] = useState("text");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pollRef = useRef(null);

  useEffect(() => {
    api.getProblem(id).then(setProblem).catch(console.error);
    return () => clearInterval(pollRef.current);
  }, [id]);

  async function handleStart() {
    setStarting(true);
    try {
      const newAttempt = await api.startAttempt(id);
      setAttempt(newAttempt);
    } finally {
      setStarting(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await api.submit(attempt._id, { format, content, language: format === "code" ? language : undefined });
      startPolling(attempt._id);
    } finally {
      setSubmitting(false);
    }
  }

  function startPolling(attemptId) {
    pollRef.current = setInterval(async () => {
      const updated = await api.getAttempt(attemptId);
      setAttempt(updated);
      if (TERMINAL_STATUSES.includes(updated.evaluation?.status)) {
        clearInterval(pollRef.current);
      }
    }, 2000);
  }

  const isEvaluating = attempt?.evaluation && !TERMINAL_STATUSES.includes(attempt.evaluation.status);

  if (!problem) {
    return <p className="text-sm text-subink">Loading problem…</p>;
  }

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-subink hover:text-blueprint mb-6 transition-colors">
        <ArrowLeft size={14} /> All problems
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">{problem.title}</h1>
        <DifficultyTag level={problem.difficulty} />
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Specification */}
        <Panel className="md:col-span-2 p-5 h-fit">
          <p className="text-xs font-mono text-subink mb-3">SPECIFICATION</p>
          <p className="text-sm text-ink leading-relaxed mb-5">{problem.description}</p>
          <p className="text-xs font-mono text-subink mb-2">REQUIREMENTS</p>
          <ol className="grid gap-2">
            {problem.requirements.map((r, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-ink leading-snug">
                <span className="font-mono text-blueprint shrink-0">{String(i + 1).padStart(2, "0")}</span>
                {r}
              </li>
            ))}
          </ol>
        </Panel>

        {/* Submission / result */}
        <div className="md:col-span-3 grid gap-6">
          {!attempt && (
            <Panel className="p-6 text-center">
              <p className="text-sm text-subink mb-4">Start an attempt when you're ready to design a solution.</p>
              <Button onClick={handleStart} disabled={starting}>
                {starting ? "Starting…" : "Start attempt"}
              </Button>
            </Panel>
          )}

          {attempt && attempt.status === "InProgress" && (
            <Panel className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex rounded bg-paper border border-line p-1 text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => setFormat("text")}
                    className={`rounded px-3 py-1.5 transition-colors ${
                      format === "text" ? "bg-white shadow-panel text-ink" : "text-subink"
                    }`}
                  >
                    Design write-up
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat("code")}
                    className={`rounded px-3 py-1.5 transition-colors ${
                      format === "code" ? "bg-white shadow-panel text-ink" : "text-subink"
                    }`}
                  >
                    Code
                  </button>
                </div>
                {format === "code" && (
                  <input
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="language"
                    className="w-28 rounded border border-line bg-white px-2.5 py-1.5 text-xs font-mono text-ink outline-none focus:border-blueprint"
                  />
                )}
              </div>

              <textarea
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  format === "text"
                    ? "Describe your classes, responsibilities, relationships, and key trade-offs…"
                    : "Paste your class/interface implementation…"
                }
                className={`w-full rounded border border-line bg-ink/[0.02] px-4 py-3 text-sm text-ink outline-none focus:border-blueprint resize-y ${
                  format === "code" ? "font-mono" : ""
                }`}
              />

              <div className="flex justify-end mt-4">
                <Button onClick={handleSubmit} disabled={!content.trim() || submitting}>
                  {submitting ? "Submitting…" : "Submit"}
                </Button>
              </div>
            </Panel>
          )}

          {isEvaluating && (
            <Panel className="p-6 flex items-center gap-3">
              <Loader2 size={18} className="animate-spin text-blueprint" />
              <p className="text-sm text-subink">Evaluating your submission…</p>
            </Panel>
          )}

          {attempt?.evaluation && TERMINAL_STATUSES.includes(attempt.evaluation.status) && (
            <Panel className="p-5">
              <div className="flex items-center gap-2.5 mb-4">
                {attempt.evaluation.status === "Completed" ? (
                  <CircleCheck size={18} className="text-forest" />
                ) : (
                  <CircleX size={18} className="text-rust" />
                )}
                <h2 className="font-display font-semibold text-ink">
                  Evaluation {attempt.evaluation.status === "Completed" ? "complete" : "failed"}
                </h2>
              </div>

              {attempt.evaluation.status === "Failed" && (
                <p className="rounded border border-rust/30 bg-rust-tint px-3 py-2 text-sm text-rust">
                  {attempt.evaluation.errorMessage}
                </p>
              )}

              {attempt.evaluation.status === "Completed" && (
                <>
                  <p className="text-sm text-ink leading-relaxed mb-5">{attempt.evaluation.overallSummary}</p>
                  <div className="grid gap-3">
                    {attempt.evaluation.feedbackItems.map((f) => (
                      <div key={f.criterion} className="border border-line rounded p-4">
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <span className="text-sm font-medium text-ink">{f.criterion}</span>
                          <ScoreBar score={f.score} />
                        </div>
                        <p className="text-sm text-subink leading-relaxed">
                          <span className="text-ink">Evidence:</span> {f.evidence}
                        </p>
                        {f.concern && (
                          <p className="text-sm text-rust leading-relaxed mt-1.5">
                            <span className="font-medium">Concern:</span> {f.concern}
                          </p>
                        )}
                        {f.suggestion && (
                          <p className="text-sm text-blueprint leading-relaxed mt-1.5">
                            <span className="font-medium">Suggestion:</span> {f.suggestion}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

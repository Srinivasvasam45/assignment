import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { PageHeader, Panel, StatusTag, ScoreBar, EmptyState, Button } from "../components/ui.jsx";

export default function AttemptHistory() {
  const [attempts, setAttempts] = useState(null);

  useEffect(() => {
    api.listAttempts().then(setAttempts).catch(() => setAttempts([]));
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Your history"
        title="My attempts"
        description="Every attempt you've submitted, with its evaluation outcome."
      />

      {attempts === null && <p className="text-sm text-subink">Loading attempts…</p>}

      {attempts?.length === 0 && (
        <EmptyState
          title="No attempts yet"
          body="You haven't attempted a problem yet. Pick one from the problem list to get started."
          action={
            <Link to="/">
              <Button variant="secondary">Browse problems</Button>
            </Link>
          }
        />
      )}

      {attempts && attempts.length > 0 && (
        <Panel>
          <ul className="divide-y divide-line">
            {attempts.map((a) => {
              const avgScore =
                a.evaluation?.status === "Completed"
                  ? a.evaluation.feedbackItems.reduce((s, f) => s + f.score, 0) / a.evaluation.feedbackItems.length
                  : null;
              return (
                <li key={a._id} className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap">
                  <span className="text-sm font-medium text-ink">{a.problemId?.title}</span>
                  <span className="flex items-center gap-3">
                    <StatusTag status={a.status} />
                    {a.evaluation && <StatusTag status={a.evaluation.status} />}
                    {avgScore !== null && <ScoreBar score={Math.round(avgScore)} />}
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </div>
  );
}

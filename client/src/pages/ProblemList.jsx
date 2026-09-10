import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { api } from "../api/client.js";
import { DifficultyTag, PageHeader, Panel, EmptyState } from "../components/ui.jsx";

export default function ProblemList() {
  const [problems, setProblems] = useState(null);

  useEffect(() => {
    api.listProblems().then(setProblems).catch(() => setProblems([]));
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Problem set"
        title="Low-level design problems"
        description="Pick a problem, write up your design or code, and get scored feedback per criterion."
      />

      {problems === null && (
        <p className="text-sm text-subink">Loading problems…</p>
      )}

      {problems?.length === 0 && (
        <EmptyState
          title="No problems available yet"
          body="Check back soon — new design problems are added regularly."
        />
      )}

      {problems && problems.length > 0 && (
        <Panel>
          <ul className="divide-y divide-line">
            {problems.map((p) => (
              <li key={p._id}>
                <Link
                  to={`/problems/${p._id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-paper transition-colors group"
                >
                  <span className="font-medium text-ink text-sm">{p.title}</span>
                  <span className="flex items-center gap-3 shrink-0">
                    <DifficultyTag level={p.difficulty} />
                    <ChevronRight size={16} className="text-subink group-hover:text-blueprint transition-colors" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}

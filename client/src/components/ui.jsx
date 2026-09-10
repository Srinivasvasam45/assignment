// Small shared building blocks used across pages, so every screen shares
// the same visual language instead of re-deriving styles per page.

const DIFFICULTY_STYLES = {
  Easy: "bg-forest-tint text-forest border-forest/30",
  Medium: "bg-brass-tint text-brass border-brass/30",
  Hard: "bg-rust-tint text-rust border-rust/30",
};

export function DifficultyTag({ level }) {
  const cls = DIFFICULTY_STYLES[level] || "bg-line/40 text-subink border-line";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono ${cls}`}>
      {level}
    </span>
  );
}

const STATUS_STYLES = {
  Completed: "bg-forest-tint text-forest border-forest/30",
  Failed: "bg-rust-tint text-rust border-rust/30",
  InProgress: "bg-blueprint-tint text-blueprint border-blueprint/30",
  Pending: "bg-brass-tint text-brass border-brass/30",
};

export function StatusTag({ status }) {
  const cls = STATUS_STYLES[status] || "bg-line/40 text-subink border-line";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

export function Panel({ children, className = "" }) {
  return (
    <div className={`bg-panel border border-line rounded-md shadow-panel ${className}`}>
      {children}
    </div>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded font-medium text-sm px-4 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blueprint text-white hover:bg-blueprint-dark",
    secondary: "bg-transparent border border-line text-ink hover:border-blueprint hover:text-blueprint",
    ghost: "bg-transparent text-subink hover:text-ink",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Field({ label, children }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-subink">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      className="w-full rounded border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-subink/60 focus:border-blueprint outline-none"
      {...props}
    />
  );
}

// Encodes a 0-5 score as five discrete ticks rather than a plain number,
// so the evaluation panel reads at a glance.
export function ScoreBar({ score, max = 5 }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`h-3 w-2 rounded-sm ${i < score ? "bg-blueprint" : "bg-line"}`}
          />
        ))}
      </div>
      <span className="font-mono text-xs text-subink">{score}/{max}</span>
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="border border-dashed border-line rounded-md py-14 px-6 text-center">
      <p className="font-display font-semibold text-ink">{title}</p>
      <p className="mt-1.5 text-sm text-subink max-w-sm mx-auto">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
      <div>
        {eyebrow && <p className="text-xs font-mono text-subink mb-1.5">{eyebrow}</p>}
        <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-subink max-w-lg">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

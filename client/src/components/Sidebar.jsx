import { NavLink, useNavigate } from "react-router-dom";
import { ListChecks, History, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Problems", icon: ListChecks, end: true },
  { to: "/history", label: "My Attempts", icon: History, end: false },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-line bg-panel/60 px-5 py-6">
      <div className="mb-10 flex items-center gap-2">
        <span className="font-display font-bold text-lg text-ink">{"{ LLD }"}</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blueprint-tint text-blueprint"
                  : "text-subink hover:bg-line/40 hover:text-ink"
              }`
            }
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-2.5 rounded px-3 py-2 text-sm font-medium text-subink hover:bg-line/40 hover:text-rust transition-colors"
      >
        <LogOut size={16} strokeWidth={2} />
        Log out
      </button>
    </aside>
  );
}

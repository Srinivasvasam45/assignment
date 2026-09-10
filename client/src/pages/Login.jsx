import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { Button, Field, TextInput, Panel } from "../components/ui.jsx";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = mode === "login" ? await api.login(form) : await api.register(form);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display font-bold text-xl text-ink">{"{ LLD }"}</span>
          <p className="mt-1.5 text-sm text-subink">Practice low-level design, get structured feedback.</p>
        </div>

        <Panel className="p-6">
          <div className="flex rounded bg-paper border border-line p-1 mb-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded py-1.5 transition-colors ${
                mode === "login" ? "bg-white shadow-panel text-ink" : "text-subink"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded py-1.5 transition-colors ${
                mode === "register" ? "bg-white shadow-panel text-ink" : "text-subink"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {mode === "register" && (
              <Field label="Name">
                <TextInput
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ada Lovelace"
                />
              </Field>
            )}
            <Field label="Email">
              <TextInput
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Password">
              <TextInput
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </Field>

            {error && (
              <p className="rounded border border-rust/30 bg-rust-tint px-3 py-2 text-sm text-rust">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-1">
              {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </Button>
          </form>
        </Panel>
      </div>
    </div>
  );
}

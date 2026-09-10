const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  listProblems: () => request("/problems"),
  getProblem: (id) => request(`/problems/${id}`),
  startAttempt: (problemId) => request("/attempts", { method: "POST", body: JSON.stringify({ problemId }) }),
  listAttempts: (problemId) => request(`/attempts${problemId ? `?problemId=${problemId}` : ""}`),
  getAttempt: (id) => request(`/attempts/${id}`),
  submit: (attemptId, body) =>
    request(`/attempts/${attemptId}/submissions`, { method: "POST", body: JSON.stringify(body) }),
};

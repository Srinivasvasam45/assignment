import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login.jsx";
import ProblemList from "./pages/ProblemList.jsx";
import ProblemDetail from "./pages/ProblemDetail.jsx";
import AttemptHistory from "./pages/AttemptHistory.jsx";
import Sidebar from "./components/Sidebar.jsx";

function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}

function DashboardLayout() {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 px-6 py-8 md:px-12 md:py-10">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<ProblemList />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/history" element={<AttemptHistory />} />
      </Route>
    </Routes>
  );
}

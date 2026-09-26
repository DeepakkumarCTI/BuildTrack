import { Navigate, Route, Routes } from "react-router-dom";
import { useApp } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Projects from "./pages/admin/Projects";
import ProjectDetails from "./pages/admin/ProjectDetails";
import Materials from "./pages/admin/Materials";
import Attendance from "./pages/admin/Attendance";
import Workers from "./pages/admin/Workers";
import WorkerHome from "./pages/worker/WorkerHome";

export default function App() {
  const { currentUser } = useApp();

  const homeRoute =
    currentUser?.role === "admin"
      ? "/admin"
      : currentUser?.role === "labour"
        ? "/worker"
        : "/login";

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]} />
        }
      >
        <Route element={<Layout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/projects" element={<Projects />} />
          <Route path="/admin/projects/:id" element={<ProjectDetails />} />
          <Route path="/admin/materials" element={<Materials />} />
          <Route path="/admin/attendance" element={<Attendance />} />
          <Route path="/admin/workers" element={<Workers />} />
        </Route>
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["labour"]} />
        }
      >
        <Route element={<Layout />}>
          <Route path="/worker" element={<WorkerHome />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={homeRoute} replace />} />
      <Route path="*" element={<Navigate to={homeRoute} replace />} />
    </Routes>
  );
}

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

  return (
    <Routes>

      {/* ================================================================
          LOGIN
          ================================================================ */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* ================================================================
          ADMIN ROUTES
          ================================================================ */}

      <Route element={<ProtectedRoute role="admin" />}>

        {/* --------------------------------------------------------------
            ADMIN PAGES WITH NAVBAR + SIDEBAR
            -------------------------------------------------------------- */}

        <Route element={<Layout />}>

          {/* Dashboard */}
          <Route
            path="/admin"
            element={<Dashboard />}
          />

          {/* Projects */}
          <Route
            path="/admin/projects"
            element={<Projects />}
          />

          {/* Project Details */}
          <Route
            path="/admin/projects/:id"
            element={<ProjectDetails />}
          />

          {/* Materials */}
          <Route
            path="/admin/materials"
            element={<Materials />}
          />

        </Route>

        {/* --------------------------------------------------------------
            STANDALONE ADMIN PAGES

            These pages are intentionally OUTSIDE Layout.

            Therefore:
            - No navbar
            - No sidebar
            - No admin navigation
            -------------------------------------------------------------- */}

        {/* Attendance */}
        <Route
          path="/admin/attendance"
          element={<Attendance />}
        />

        {/* Labour Accounts */}
        <Route
          path="/admin/workers"
          element={<Workers />}
        />

      </Route>

      {/* ================================================================
          WORKER ROUTES
          ================================================================ */}

      <Route element={<ProtectedRoute role="labour" />}>

        <Route element={<Layout />}>

          <Route
            path="/worker"
            element={<WorkerHome />}
          />

        </Route>

      </Route>

      {/* ================================================================
          ROOT REDIRECT
          ================================================================ */}

      <Route
        path="/"
        element={
          <Navigate
            to={
              currentUser
                ? currentUser.role === "admin"
                  ? "/admin"
                  : "/worker"
                : "/login"
            }
            replace
          />
        }
      />

      {/* ================================================================
          UNKNOWN ROUTES
          ================================================================ */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}
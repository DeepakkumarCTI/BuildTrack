import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute({ role }) {
  const { currentUser } = useApp();
  const location = useLocation();
  if (!currentUser) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role && currentUser.role !== role) return <Navigate to={currentUser.role === "admin" ? "/admin" : "/worker"} replace />;
  return <Outlet />;
}
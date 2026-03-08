import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function RoleGuard({ role, children }) {
  const location = useLocation();
  const { loading, isAuthenticated, userRole } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />;
  }

  if (userRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

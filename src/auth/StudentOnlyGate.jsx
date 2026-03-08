import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function StudentOnlyGate({ children }) {
  const { isAuthenticated, userRole } = useAuth();

  if (isAuthenticated && userRole === "teacher") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

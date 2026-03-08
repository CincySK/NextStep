import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function ProtectedRoute({ children, allowGuest = false }) {
  const location = useLocation();
  const { loading, isAuthenticated, isConfigured, authError, isGuestMode, selectedRole } = useAuth();

  if (loading) {
    return (
      <section className="auth-shell">
        <article className="auth-card auth-state-card">
          <div className="auth-loading-dot" aria-hidden />
          <h1>Loading your account...</h1>
          <p>Checking your session and restoring your NextStep data.</p>
        </article>
      </section>
    );
  }

  if (allowGuest && isGuestMode) {
    return children;
  }

  if (!isConfigured) {
    return (
      <section className="auth-shell">
        <article className="auth-card auth-state-card">
          <h1>Authentication setup is required</h1>
          <p>{authError || "Set Supabase environment variables to enable account access."}</p>
        </article>
      </section>
    );
  }

  if (!isAuthenticated) {
    if (!selectedRole) return <Navigate to="/auth/role" replace />;
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />;
  }

  return children;
}

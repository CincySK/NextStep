import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { hasGuestData } from "../auth/GuestSessionManager";
import { consumeOAuthError, consumeOAuthRoleNotice } from "../auth/oauthSession";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { completeOAuthLogin, loading, selectedRole, userRole } = useAuth();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(() => consumeOAuthError());
  const [notice, setNotice] = useState(() => consumeOAuthRoleNotice());
  const [needsMigrationChoice, setNeedsMigrationChoice] = useState(false);

  useEffect(() => {
    const raw = window.location.href;
    if (/error=/.test(raw) && !error) {
      setError("Google sign-in was canceled or failed. Please try again.");
      setBusy(false);
      return;
    }

    if (loading) return;

    async function run() {
      try {
        const shouldAskMigration = hasGuestData();
        if (shouldAskMigration) {
          setNeedsMigrationChoice(true);
          setBusy(false);
          return;
        }

        const result = await completeOAuthLogin({ migrateGuestProgress: true });
        navigate(result.resumeOnboarding ? "/" : "/dashboard", { replace: true });
      } catch (err) {
        setError(err.message ?? "Could not complete Google sign-in.");
      } finally {
        setBusy(false);
      }
    }

    run();
  }, [completeOAuthLogin, loading, navigate]);

  async function finish(migrateGuestProgress) {
    setBusy(true);
    setError("");
    try {
      const result = await completeOAuthLogin({ migrateGuestProgress });
      navigate(result.resumeOnboarding ? "/" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message ?? "Could not complete Google sign-in.");
      setBusy(false);
    }
  }

  if (!selectedRole && !userRole && !busy && !error) {
    return (
      <section className="auth-shell">
        <article className="auth-card auth-state-card">
          <h1>Role selection required</h1>
          <p>Please choose Student or Teacher before continuing with Google.</p>
          <Link className="primary-btn" to="/auth/role">Choose Role</Link>
        </article>
      </section>
    );
  }

  return (
    <section className="auth-shell">
      <article className="auth-card auth-state-card">
        <div className="auth-loading-dot" aria-hidden />
        <h1>{busy ? "Completing Google sign-in..." : "Google Sign-in Ready"}</h1>
        <p>
          {busy
            ? "Restoring your account session and profile."
            : "Choose whether to save your guest progress to this account."}
        </p>

        {notice && <p className="feedback">{notice}</p>}
        {error && (
          <div className="auth-error">
            <p>{error}</p>
            <p><Link to="/login">Return to login</Link></p>
          </div>
        )}

        {!busy && needsMigrationChoice && !error && (
          <div className="cta-row">
            <button type="button" className="primary-btn" onClick={() => finish(true)}>
              Save Guest Progress
            </button>
            <button type="button" className="secondary-btn" onClick={() => finish(false)}>
              Skip Migration
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

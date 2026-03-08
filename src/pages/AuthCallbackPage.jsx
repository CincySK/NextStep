import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { hasGuestData } from "../auth/GuestSessionManager";
import { consumeOAuthError, consumeOAuthRoleNotice } from "../auth/oauthSession";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { completeOAuthLogin, loading, selectedRole, session, userRole } = useAuth();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(() => consumeOAuthError());
  const [notice, setNotice] = useState(() => consumeOAuthRoleNotice());
  const [needsMigrationChoice, setNeedsMigrationChoice] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const raw = window.location.href;
    const parsedUrl = new URL(raw.replace("#/", "/"));
    const hashParams = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
    const queryParams = parsedUrl.searchParams;
    const errorCode = hashParams.get("error") || queryParams.get("error");
    const errorDescription = hashParams.get("error_description") || queryParams.get("error_description");
    if (errorCode && !error) {
      let safeDescription = "Google sign-in was canceled or failed. Please try again.";
      if (errorDescription) {
        try {
          safeDescription = decodeURIComponent(errorDescription);
        } catch {
          safeDescription = errorDescription;
        }
      }
      setError(safeDescription);
      setBusy(false);
      return;
    }

    if (loading) return;

    async function run() {
      try {
        const shouldAskMigration = hasGuestData() && Boolean(session?.user?.id);
        if (shouldAskMigration) {
          setNeedsMigrationChoice(true);
          setBusy(false);
          return;
        }

        const result = await completeOAuthLogin({ migrateGuestProgress: true, requireRole: true });
        navigate(result.resumeOnboarding ? "/" : "/dashboard", { replace: true });
      } catch (err) {
        const message = err.message ?? "Could not complete Google sign-in.";
        if (/No authenticated session found/i.test(message) && attempt < 3) {
          setTimeout(() => setAttempt((value) => value + 1), 450);
          return;
        }
        setError(message);
      } finally {
        setBusy(false);
      }
    }

    run();
  }, [attempt, completeOAuthLogin, error, loading, navigate, session?.user?.id]);

  async function finish(migrateGuestProgress) {
    setBusy(true);
    setError("");
    try {
      const result = await completeOAuthLogin({ migrateGuestProgress, requireRole: true });
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
        <p className="auth-callback-copy">
          {busy
            ? "Restoring your account session and profile."
            : "Choose whether to save your guest progress to this account."}
        </p>

        {notice && <p className="feedback">{notice}</p>}
        {error && (
          <div className="auth-error oauth-error-card">
            <p>{error}</p>
            <div className="cta-row">
              <Link className="secondary-btn" to="/login">Return to login</Link>
              <Link className="secondary-btn" to="/auth/role">Switch role</Link>
            </div>
          </div>
        )}

        {!busy && needsMigrationChoice && !error && (
          <section className="oauth-migration-card">
            <h3>Save your guest progress?</h3>
            <p>Keep your onboarding data, quiz progress, results, and personalization in this account.</p>
            <div className="cta-row">
              <button type="button" className="primary-btn" onClick={() => finish(true)}>
                Save Guest Progress
              </button>
              <button type="button" className="secondary-btn" onClick={() => finish(false)}>
                Skip Migration
              </button>
            </div>
          </section>
        )}

        {!busy && !needsMigrationChoice && !error && (
          <div className="oauth-success-note">
            <p>Sign-in complete. Redirecting to your dashboard...</p>
          </div>
        )}
      </article>
    </section>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPasswordPage() {
  const { resetPassword, isConfigured, authError } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const canSubmit = isValidEmail(email) && isConfigured;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setMessage("If that email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.message ?? "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-shell">
      <article className="auth-card auth-card-enter">
        <p className="quiz-flow-label">Account Recovery</p>
        <h1>Reset your password</h1>
        <p>Enter your email and we will send a reset link.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field" htmlFor="forgot-email">
            <span>Email</span>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              data-valid={isValidEmail(email) ? "true" : "false"}
            />
          </label>

          {!isConfigured && <p className="auth-error">{authError}</p>}
          {error && <p className="auth-error">{error}</p>}
          {message && <p className="feedback">{message}</p>}

          <button className="primary-btn auth-submit" type="submit" disabled={loading || !canSubmit}>
            {loading && <span className="btn-spinner" aria-hidden />}
            <span>{loading ? "Sending..." : "Send Reset Link"}</span>
          </button>
        </form>

        <div className="auth-footer">
          <p><Link to="/login">Back to login</Link></p>
        </div>
      </article>
    </section>
  );
}

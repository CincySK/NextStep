import { useState } from "react";
import { useAuth } from "../auth/useAuth";

export default function ProfilePage() {
  const { user, updateDisplayName, userRole } = useAuth();
  const provider = user?.user_metadata?.authProvider ?? user?.app_metadata?.provider ?? "email";
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (displayName.trim().length < 2) {
      setError("Display name must be at least 2 characters.");
      return;
    }
    setLoading(true);
    try {
      await updateDisplayName(displayName.trim());
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.message ?? "Could not update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-card module-card">
      <div className="section-header">
        <div>
          <h2>Your Profile</h2>
          <p className="intro-copy">Manage your basic account information.</p>
        </div>
      </div>

      <article className="mini-card">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {userRole === "teacher" ? "Teacher" : "Student"}</p>
        <p><strong>Provider:</strong> {provider}</p>
        <p><strong>Joined:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}</p>
      </article>

      <form className="auth-form profile-form" onSubmit={handleSubmit}>
        <label className="auth-field" htmlFor="profile-name">
          <span>Display Name</span>
          <input
            id="profile-name"
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your display name"
            data-valid={displayName.trim().length >= 2 ? "true" : "false"}
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="feedback">{message}</p>}
        <button className="primary-btn" type="submit" disabled={loading}>
          {loading && <span className="btn-spinner" aria-hidden />}
          <span>{loading ? "Saving..." : "Save Changes"}</span>
        </button>
      </form>
    </section>
  );
}

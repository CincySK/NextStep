export default function GoogleSignInButton({ onClick, loading = false, disabled = false, label = "Continue with Google" }) {
  return (
    <button
      type="button"
      className="google-btn"
      onClick={onClick}
      disabled={disabled || loading}
    >
      <span className="google-icon" aria-hidden>
        <span className="g-red">G</span>
      </span>
      <span>{loading ? "Redirecting..." : label}</span>
    </button>
  );
}

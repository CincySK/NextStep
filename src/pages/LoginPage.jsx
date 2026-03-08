import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { useAuth } from "../auth/useAuth";
import { hasGuestData } from "../auth/GuestSessionManager";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const { signIn, isAuthenticated, isConfigured, authError, isGuestMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [migrateGuestProgress, setMigrateGuestProgress] = useState(true);
  const resumeOnboarding = Boolean(location.state?.resumeOnboarding);
  const showMigrationOption = isGuestMode && hasGuestData();

  const destination = useMemo(() => (resumeOnboarding ? "/" : (location.state?.from ?? "/dashboard")), [location.state?.from, resumeOnboarding]);
  const canSubmit = isValidEmail(values.email) && values.password.length > 0 && isConfigured;
  const fieldState = {
    emailValid: touched.email && isValidEmail(values.email),
    passwordValid: touched.password && values.password.length > 0
  };

  if (isAuthenticated) return <Navigate to={destination} replace />;

  function onChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev, global: "" };
      if (name === "email" && touched.email) next.email = isValidEmail(value) ? "" : "Please enter a valid email address.";
      if (name === "password" && touched.password) next.password = value ? "" : "Please enter your password.";
      return next;
    });
  }

  function onBlur(event) {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: isValidEmail(value) ? "" : "Please enter a valid email address." }));
    }
    if (name === "password") {
      setErrors((prev) => ({ ...prev, password: value ? "" : "Please enter your password." }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!isValidEmail(values.email)) nextErrors.email = "Please enter a valid email address.";
    if (!values.password) nextErrors.password = "Please enter your password.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      await signIn({
        email: values.email.trim(),
        password: values.password,
        migrateGuestProgress
      });
      navigate(destination, { replace: true, state: resumeOnboarding ? { resumeOnboarding: true } : {} });
    } catch (error) {
      setErrors({ global: error.message ?? "Could not sign in. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      mode="login"
      title="Log in to NextStep"
      subtitle="Continue your personalized future-planning journey."
      values={values}
      errors={{
        ...errors,
        global: errors.global ?? (!isConfigured ? authError : "")
      }}
      loading={loading}
      canSubmit={canSubmit}
      fieldState={fieldState}
      submitLabel="Log In"
      onChange={onChange}
      onBlur={onBlur}
      onSubmit={handleSubmit}
      footer={(
        <div className="auth-footer">
          {showMigrationOption && (
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={migrateGuestProgress}
                onChange={(event) => setMigrateGuestProgress(event.target.checked)}
              />
              <span>Save my guest progress into this account</span>
            </label>
          )}
          {resumeOnboarding && <p className="auth-helper">You&apos;ll return to onboarding right after login.</p>}
          <Link to="/forgot-password">Forgot password?</Link>
          <p>Need an account? <Link to="/signup">Sign up</Link></p>
        </div>
      )}
    />
  );
}

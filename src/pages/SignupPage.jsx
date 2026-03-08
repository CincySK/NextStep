import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { useAuth } from "../auth/useAuth";
import { hasGuestData } from "../auth/GuestSessionManager";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignupPage() {
  const { signUp, isAuthenticated, isConfigured, authError, isGuestMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [values, setValues] = useState({ displayName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [migrateGuestProgress, setMigrateGuestProgress] = useState(true);
  const resumeOnboarding = Boolean(location.state?.resumeOnboarding);
  const showMigrationOption = isGuestMode && hasGuestData();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  const canSubmit = values.displayName.trim().length >= 2
    && isValidEmail(values.email)
    && values.password.length >= 8
    && isConfigured;
  const fieldState = {
    displayNameValid: touched.displayName && values.displayName.trim().length >= 2,
    emailValid: touched.email && isValidEmail(values.email),
    passwordValid: touched.password && values.password.length >= 8
  };

  function onChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev, global: "" };
      if (name === "displayName" && touched.displayName) next.displayName = value.trim().length >= 2 ? "" : "Please enter a name (at least 2 characters).";
      if (name === "email" && touched.email) next.email = isValidEmail(value) ? "" : "Please enter a valid email address.";
      if (name === "password" && touched.password) next.password = value.length >= 8 ? "" : "Password must be at least 8 characters.";
      return next;
    });
    setSuccess("");
  }

  function onBlur(event) {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === "displayName") {
      setErrors((prev) => ({ ...prev, displayName: value.trim().length >= 2 ? "" : "Please enter a name (at least 2 characters)." }));
    }
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: isValidEmail(value) ? "" : "Please enter a valid email address." }));
    }
    if (name === "password") {
      setErrors((prev) => ({ ...prev, password: value.length >= 8 ? "" : "Password must be at least 8 characters." }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if ((values.displayName ?? "").trim().length < 2) nextErrors.displayName = "Please enter a name (at least 2 characters).";
    if (!isValidEmail(values.email)) nextErrors.email = "Please enter a valid email address.";
    if ((values.password ?? "").length < 8) nextErrors.password = "Password must be at least 8 characters.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await signUp({
        displayName: values.displayName.trim(),
        email: values.email.trim(),
        password: values.password,
        migrateGuestProgress
      });
      if (data?.session?.user) {
        navigate(resumeOnboarding ? "/" : "/dashboard", {
          replace: true,
          state: resumeOnboarding ? { resumeOnboarding: true } : {}
        });
      } else {
        setSuccess("Account created. Check your email to verify, then log in.");
      }
    } catch (error) {
      setErrors({ global: error.message ?? "Could not create account. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      mode="signup"
      title="Create your NextStep account"
      subtitle="Save your progress, quizzes, and personalized future plan."
      values={values}
      errors={{
        ...errors,
        global: errors.global ?? (!isConfigured ? authError : "")
      }}
      loading={loading}
      canSubmit={canSubmit}
      fieldState={fieldState}
      submitLabel="Create Account"
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
          {resumeOnboarding && <p className="auth-helper">After signup, you&apos;ll continue onboarding.</p>}
          {success && <p className="feedback">{success}</p>}
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      )}
    />
  );
}

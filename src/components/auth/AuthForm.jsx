import PasswordInput from "./PasswordInput";

export default function AuthForm({
  mode,
  title,
  subtitle,
  values,
  errors,
  loading,
  canSubmit = true,
  fieldState = {},
  submitLabel,
  onChange,
  onBlur,
  onSubmit,
  footer
}) {
  const isSignup = mode === "signup";
  const emailError = errors?.email ?? "";
  const passwordError = errors?.password ?? "";
  const displayNameError = errors?.displayName ?? "";

  return (
    <section className="auth-shell">
      <article className="auth-card auth-card-enter">
        <p className="quiz-flow-label">{isSignup ? "Create Account" : "Welcome Back"}</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>

        <form className="auth-form" onSubmit={onSubmit}>
          {isSignup && (
            <label className="auth-field" htmlFor="displayName">
              <span>Display Name</span>
              <input
                id="displayName"
                name="displayName"
                type="text"
                value={values.displayName ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="How should we call you?"
                autoComplete="name"
                required
                aria-invalid={Boolean(displayNameError)}
                data-valid={fieldState.displayNameValid ? "true" : "false"}
              />
              {displayNameError && <p className="auth-inline-error">{displayNameError}</p>}
            </label>
          )}

          <label className="auth-field" htmlFor="email">
            <span>Email</span>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email ?? ""}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="you@example.com"
              autoComplete="email"
              required
              aria-invalid={Boolean(emailError)}
              data-valid={fieldState.emailValid ? "true" : "false"}
            />
            {emailError && <p className="auth-inline-error">{emailError}</p>}
          </label>

          <PasswordInput
            id="password"
            name="password"
            label="Password"
            value={values.password ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={isSignup ? "At least 8 characters" : "Your password"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            inputValid={fieldState.passwordValid}
          />
          {passwordError && <p className="auth-inline-error">{passwordError}</p>}
          {isSignup && !passwordError && <p className="auth-helper">Use at least 8 characters for stronger security.</p>}

          {errors?.global && <p className="auth-error">{errors.global}</p>}

          <button className="primary-btn auth-submit" type="submit" disabled={loading || !canSubmit}>
            {loading && <span className="btn-spinner" aria-hidden />}
            <span>{loading ? "Please wait..." : submitLabel}</span>
          </button>
        </form>

        {footer}
      </article>
    </section>
  );
}

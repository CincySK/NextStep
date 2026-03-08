const OAUTH_ROLE_KEY = "nextstep_oauth_role";
const OAUTH_RESUME_KEY = "nextstep_oauth_resume_onboarding";
const OAUTH_ERROR_KEY = "nextstep_oauth_error";
const OAUTH_ROLE_NOTICE_KEY = "nextstep_oauth_role_notice";

export function setOAuthIntent({ role, resumeOnboarding = false }) {
  if (role) sessionStorage.setItem(OAUTH_ROLE_KEY, role);
  sessionStorage.setItem(OAUTH_RESUME_KEY, resumeOnboarding ? "true" : "false");
}

export function getOAuthIntent() {
  const role = sessionStorage.getItem(OAUTH_ROLE_KEY) ?? "";
  const resumeOnboarding = sessionStorage.getItem(OAUTH_RESUME_KEY) === "true";
  return { role, resumeOnboarding };
}

export function clearOAuthIntent() {
  sessionStorage.removeItem(OAUTH_ROLE_KEY);
  sessionStorage.removeItem(OAUTH_RESUME_KEY);
}

export function setOAuthError(message) {
  sessionStorage.setItem(OAUTH_ERROR_KEY, message);
}

export function consumeOAuthError() {
  const value = sessionStorage.getItem(OAUTH_ERROR_KEY) ?? "";
  sessionStorage.removeItem(OAUTH_ERROR_KEY);
  return value;
}

export function setOAuthRoleNotice(message) {
  sessionStorage.setItem(OAUTH_ROLE_NOTICE_KEY, message);
}

export function consumeOAuthRoleNotice() {
  const value = sessionStorage.getItem(OAUTH_ROLE_NOTICE_KEY) ?? "";
  sessionStorage.removeItem(OAUTH_ROLE_NOTICE_KEY);
  return value;
}

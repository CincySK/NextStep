const COMPLETE_KEY = "nextstep_onboarding_complete";
const DATA_KEY = "nextstep_onboarding_data";

export function isOnboardingComplete() {
  return localStorage.getItem(COMPLETE_KEY) === "true";
}

export function loadOnboardingData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function completeOnboarding(data) {
  localStorage.setItem(COMPLETE_KEY, "true");
  localStorage.setItem(
    DATA_KEY,
    JSON.stringify({
      ...data,
      completedAt: new Date().toISOString()
    })
  );
}

export function resetOnboarding() {
  localStorage.removeItem(COMPLETE_KEY);
  localStorage.removeItem(DATA_KEY);
}

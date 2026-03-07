const COMPLETE_KEY = "nextstep_onboarding_complete";
const DATA_KEY = "nextstep_onboarding_data";
const STATE_KEY = "nextstep_onboarding_state";

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

export function loadOnboardingState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function savePrimaryPathSelection(primaryPath) {
  const previous = loadOnboardingState() ?? {};
  const next = {
    ...previous,
    primaryPath,
    selectedAt: previous.selectedAt ?? new Date().toISOString(),
    completedAt: null
  };
  localStorage.setItem(STATE_KEY, JSON.stringify(next));
  return next;
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

  const state = loadOnboardingState() ?? {};
  localStorage.setItem(
    STATE_KEY,
    JSON.stringify({
      ...state,
      ...data,
      completedAt: new Date().toISOString()
    })
  );
}

export function resetOnboarding() {
  localStorage.removeItem(COMPLETE_KEY);
  localStorage.removeItem(DATA_KEY);
  localStorage.removeItem(STATE_KEY);
}

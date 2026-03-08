import { getAnonymousStorageKey, getScopedStorageKey } from "../auth/storageScope";

const COMPLETE_KEY = "nextstep_onboarding_complete";
const DATA_KEY = "nextstep_onboarding_data";
const STATE_KEY = "nextstep_onboarding_state";

export function isOnboardingComplete() {
  return localStorage.getItem(getScopedStorageKey(COMPLETE_KEY)) === "true";
}

export function loadOnboardingData() {
  try {
    const raw = localStorage.getItem(getScopedStorageKey(DATA_KEY))
      ?? localStorage.getItem(getAnonymousStorageKey(DATA_KEY));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadOnboardingState() {
  try {
    const raw = localStorage.getItem(getScopedStorageKey(STATE_KEY))
      ?? localStorage.getItem(getAnonymousStorageKey(STATE_KEY));
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
  localStorage.setItem(getScopedStorageKey(STATE_KEY), JSON.stringify(next));
  return next;
}

export function completeOnboarding(data) {
  localStorage.setItem(getScopedStorageKey(COMPLETE_KEY), "true");
  localStorage.setItem(
    getScopedStorageKey(DATA_KEY),
    JSON.stringify({
      ...data,
      completedAt: new Date().toISOString()
    })
  );

  const state = loadOnboardingState() ?? {};
  localStorage.setItem(
    getScopedStorageKey(STATE_KEY),
    JSON.stringify({
      ...state,
      ...data,
      completedAt: new Date().toISOString()
    })
  );
}

export function resetOnboarding() {
  localStorage.removeItem(getScopedStorageKey(COMPLETE_KEY));
  localStorage.removeItem(getScopedStorageKey(DATA_KEY));
  localStorage.removeItem(getScopedStorageKey(STATE_KEY));
}

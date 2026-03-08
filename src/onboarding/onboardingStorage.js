import { getAnonymousStorageKey, getScopedStorageKey } from "../auth/storageScope";
import { getSessionStorage } from "../session/SessionManager";

const COMPLETE_KEY = "nextstep_onboarding_complete";
const DATA_KEY = "nextstep_onboarding_data";
const STATE_KEY = "nextstep_onboarding_state";
const DRAFT_KEY = "nextstep_onboarding_draft";

export function isOnboardingComplete() {
  return getSessionStorage().getItem(getScopedStorageKey(COMPLETE_KEY)) === "true";
}

export function loadOnboardingData() {
  try {
    const storage = getSessionStorage();
    const raw = storage.getItem(getScopedStorageKey(DATA_KEY))
      ?? storage.getItem(getAnonymousStorageKey(DATA_KEY))
      ?? localStorage.getItem(getScopedStorageKey(DATA_KEY))
      ?? localStorage.getItem(getAnonymousStorageKey(DATA_KEY));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadOnboardingState() {
  try {
    const storage = getSessionStorage();
    const raw = storage.getItem(getScopedStorageKey(STATE_KEY))
      ?? storage.getItem(getAnonymousStorageKey(STATE_KEY))
      ?? localStorage.getItem(getScopedStorageKey(STATE_KEY))
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
  getSessionStorage().setItem(getScopedStorageKey(STATE_KEY), JSON.stringify(next));
  return next;
}

export function completeOnboarding(data) {
  const storage = getSessionStorage();
  storage.setItem(getScopedStorageKey(COMPLETE_KEY), "true");
  storage.setItem(
    getScopedStorageKey(DATA_KEY),
    JSON.stringify({
      ...data,
      completedAt: new Date().toISOString()
    })
  );

  const state = loadOnboardingState() ?? {};
  storage.setItem(
    getScopedStorageKey(STATE_KEY),
    JSON.stringify({
      ...state,
      ...data,
      completedAt: new Date().toISOString()
    })
  );
}

export function resetOnboarding() {
  const storage = getSessionStorage();
  storage.removeItem(getScopedStorageKey(COMPLETE_KEY));
  storage.removeItem(getScopedStorageKey(DATA_KEY));
  storage.removeItem(getScopedStorageKey(STATE_KEY));
  sessionStorage.removeItem(DRAFT_KEY);
}

export function saveOnboardingDraft(draft) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function loadOnboardingDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearOnboardingDraft() {
  sessionStorage.removeItem(DRAFT_KEY);
}

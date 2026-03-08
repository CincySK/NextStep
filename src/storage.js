import { getAnonymousStorageKey, getScopedStorageKey } from "./auth/storageScope";
import { getSessionStorage } from "./session/SessionManager";

const KEY = "nextstep-data-v1";
const LEGACY_KEY = "fyf-data-v1";

const defaultState = {
  progress: {
    careerComplete: false,
    collegeComplete: false,
    moneyComplete: false
  },
  favorites: [],
  scores: {
    career: null,
    college: null,
    money: null
  },
  budget: null,
  quizSessions: {
    career: null,
    college: null
  },
  quizResults: {
    career: null,
    college: null,
    money: null,
    careerHistory: []
  }
};

export function loadAppData() {
  try {
    const storage = getSessionStorage();
    const raw = storage.getItem(getScopedStorageKey(KEY))
      ?? storage.getItem(getScopedStorageKey(LEGACY_KEY))
      ?? storage.getItem(getAnonymousStorageKey(KEY))
      ?? storage.getItem(getAnonymousStorageKey(LEGACY_KEY))
      ?? localStorage.getItem(getScopedStorageKey(KEY))
      ?? localStorage.getItem(getScopedStorageKey(LEGACY_KEY))
      ?? localStorage.getItem(getAnonymousStorageKey(KEY))
      ?? localStorage.getItem(getAnonymousStorageKey(LEGACY_KEY));
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function saveAppData(next) {
  getSessionStorage().setItem(getScopedStorageKey(KEY), JSON.stringify(next));
}

export function updateAppData(updater) {
  const current = loadAppData();
  const next = updater(current);
  saveAppData(next);
  return next;
}

export function loadQuizSession(type) {
  return loadAppData().quizSessions?.[type] ?? null;
}

export function saveQuizSession(type, session) {
  return updateAppData((current) => ({
    ...current,
    quizSessions: {
      ...current.quizSessions,
      [type]: session
    }
  }));
}

export function clearQuizSession(type) {
  return updateAppData((current) => ({
    ...current,
    quizSessions: {
      ...current.quizSessions,
      [type]: null
    }
  }));
}

export function loadUserProgress(userId) {
  try {
    const raw = localStorage.getItem(getScopedStorageKey(KEY, userId))
      ?? localStorage.getItem(getScopedStorageKey(LEGACY_KEY, userId));
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

export function saveUserProgress(userId, data) {
  if (!userId) return;
  localStorage.setItem(getScopedStorageKey(KEY, userId), JSON.stringify(data));
}

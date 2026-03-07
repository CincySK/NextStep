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
    careerHistory: []
  }
};

export function loadAppData() {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function saveAppData(next) {
  localStorage.setItem(KEY, JSON.stringify(next));
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

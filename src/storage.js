const KEY = "fyf-data-v1";

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
  budget: null
};

export function loadAppData() {
  try {
    const raw = localStorage.getItem(KEY);
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
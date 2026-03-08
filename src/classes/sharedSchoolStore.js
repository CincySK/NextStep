const SHARED_SCHOOL_KEY = "nextstep-school-shared-v1";

export const defaultSchoolState = {
  classes: {},
  classOrder: [],
  assignments: {},
  assignmentOrder: [],
  documents: {},
  studentClasses: {},
  teacherClasses: {}
};

export function loadSchoolData() {
  try {
    const raw = localStorage.getItem(SHARED_SCHOOL_KEY);
    if (!raw) return { ...defaultSchoolState };
    return { ...defaultSchoolState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSchoolState };
  }
}

export function saveSchoolData(data) {
  localStorage.setItem(SHARED_SCHOOL_KEY, JSON.stringify(data));
}

export function updateSchoolData(updater) {
  const current = loadSchoolData();
  const next = updater(current);
  saveSchoolData(next);
  return next;
}

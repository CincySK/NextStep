const ACTIVE_USER_KEY = "nextstep_active_user_id";

export function getActiveUserId() {
  return localStorage.getItem(ACTIVE_USER_KEY);
}

export function setActiveUserId(userId) {
  if (!userId) {
    localStorage.removeItem(ACTIVE_USER_KEY);
    return;
  }
  localStorage.setItem(ACTIVE_USER_KEY, userId);
}

export function clearActiveUserId() {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

export function getScopedStorageKey(baseKey, userId = getActiveUserId()) {
  if (!userId) return baseKey;
  return `${baseKey}:u:${userId}`;
}

export function getAnonymousStorageKey(baseKey) {
  return baseKey;
}

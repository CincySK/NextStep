import { getAnonymousStorageKey, getScopedStorageKey } from "../auth/storageScope";
import { getSessionStorage } from "../session/SessionManager";

const PROFILE_KEY = "nextstep_personalization_profile";
const FLASH_KEY = "nextstep_personalization_flash";

export function loadPersonalizationProfile() {
  try {
    const storage = getSessionStorage();
    const raw = storage.getItem(getScopedStorageKey(PROFILE_KEY))
      ?? storage.getItem(getAnonymousStorageKey(PROFILE_KEY))
      ?? localStorage.getItem(getScopedStorageKey(PROFILE_KEY))
      ?? localStorage.getItem(getAnonymousStorageKey(PROFILE_KEY));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function savePersonalizationProfile(profile) {
  getSessionStorage().setItem(
    getScopedStorageKey(PROFILE_KEY),
    JSON.stringify({
      ...profile,
      updatedAt: new Date().toISOString()
    })
  );
}

export function clearPersonalizationProfile() {
  const storage = getSessionStorage();
  storage.removeItem(getScopedStorageKey(PROFILE_KEY));
  storage.removeItem(getScopedStorageKey(FLASH_KEY));
}

export function savePersonalizationFlash(payload) {
  getSessionStorage().setItem(
    getScopedStorageKey(FLASH_KEY),
    JSON.stringify({
      ...payload,
      createdAt: new Date().toISOString()
    })
  );
}

export function loadPersonalizationFlash() {
  try {
    const storage = getSessionStorage();
    const raw = storage.getItem(getScopedStorageKey(FLASH_KEY))
      ?? storage.getItem(getAnonymousStorageKey(FLASH_KEY))
      ?? localStorage.getItem(getScopedStorageKey(FLASH_KEY))
      ?? localStorage.getItem(getAnonymousStorageKey(FLASH_KEY));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPersonalizationFlash() {
  getSessionStorage().removeItem(getScopedStorageKey(FLASH_KEY));
}

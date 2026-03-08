import { getAnonymousStorageKey, getScopedStorageKey } from "../auth/storageScope";

const PROFILE_KEY = "nextstep_personalization_profile";
const FLASH_KEY = "nextstep_personalization_flash";

export function loadPersonalizationProfile() {
  try {
    const raw = localStorage.getItem(getScopedStorageKey(PROFILE_KEY))
      ?? localStorage.getItem(getAnonymousStorageKey(PROFILE_KEY));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function savePersonalizationProfile(profile) {
  localStorage.setItem(
    getScopedStorageKey(PROFILE_KEY),
    JSON.stringify({
      ...profile,
      updatedAt: new Date().toISOString()
    })
  );
}

export function clearPersonalizationProfile() {
  localStorage.removeItem(getScopedStorageKey(PROFILE_KEY));
  localStorage.removeItem(getScopedStorageKey(FLASH_KEY));
}

export function savePersonalizationFlash(payload) {
  localStorage.setItem(
    getScopedStorageKey(FLASH_KEY),
    JSON.stringify({
      ...payload,
      createdAt: new Date().toISOString()
    })
  );
}

export function loadPersonalizationFlash() {
  try {
    const raw = localStorage.getItem(getScopedStorageKey(FLASH_KEY))
      ?? localStorage.getItem(getAnonymousStorageKey(FLASH_KEY));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPersonalizationFlash() {
  localStorage.removeItem(getScopedStorageKey(FLASH_KEY));
}

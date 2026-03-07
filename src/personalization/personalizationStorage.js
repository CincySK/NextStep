const PROFILE_KEY = "nextstep_personalization_profile";
const FLASH_KEY = "nextstep_personalization_flash";

export function loadPersonalizationProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function savePersonalizationProfile(profile) {
  localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify({
      ...profile,
      updatedAt: new Date().toISOString()
    })
  );
}

export function clearPersonalizationProfile() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(FLASH_KEY);
}

export function savePersonalizationFlash(payload) {
  localStorage.setItem(
    FLASH_KEY,
    JSON.stringify({
      ...payload,
      createdAt: new Date().toISOString()
    })
  );
}

export function loadPersonalizationFlash() {
  try {
    const raw = localStorage.getItem(FLASH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPersonalizationFlash() {
  localStorage.removeItem(FLASH_KEY);
}

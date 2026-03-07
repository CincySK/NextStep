const PROFILE_KEY = "nextstep_personalization_profile";

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
}

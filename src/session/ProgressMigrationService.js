import { getScopedStorageKey } from "../auth/storageScope";

const MIGRATABLE_KEYS = [
  "nextstep-data-v1",
  "nextstep_onboarding_complete",
  "nextstep_onboarding_data",
  "nextstep_onboarding_state",
  "nextstep_personalization_profile",
  "nextstep_personalization_flash"
];

export function migrateGuestProgressToUser(userId) {
  if (!userId) return;
  MIGRATABLE_KEYS.forEach((key) => {
    const guestValue = sessionStorage.getItem(key);
    if (!guestValue) return;
    localStorage.setItem(getScopedStorageKey(key, userId), guestValue);
  });
}

export function clearGuestProgress() {
  MIGRATABLE_KEYS.forEach((key) => {
    sessionStorage.removeItem(key);
  });
}

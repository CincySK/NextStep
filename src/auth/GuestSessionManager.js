const GUEST_MODE_KEY = "nextstep_guest_mode";

export function isGuestMode() {
  return sessionStorage.getItem(GUEST_MODE_KEY) === "true";
}

export function startGuestMode() {
  sessionStorage.setItem(GUEST_MODE_KEY, "true");
}

export function stopGuestMode() {
  sessionStorage.removeItem(GUEST_MODE_KEY);
}

export function hasGuestData() {
  const keys = [
    "nextstep-data-v1",
    "nextstep_onboarding_data",
    "nextstep_onboarding_state",
    "nextstep_personalization_profile"
  ];
  return keys.some((key) => sessionStorage.getItem(key));
}

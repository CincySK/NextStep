import { getActiveUserId } from "../auth/storageScope";
import { isGuestMode } from "../auth/GuestSessionManager";

export function getCurrentSessionType() {
  if (getActiveUserId()) return "authenticated";
  if (isGuestMode()) return "guest";
  return "anonymous";
}

export function getSessionStorage() {
  return getCurrentSessionType() === "guest" ? sessionStorage : localStorage;
}

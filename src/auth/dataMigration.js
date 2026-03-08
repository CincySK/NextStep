import { getAnonymousStorageKey, getScopedStorageKey } from "./storageScope";

const migrationBases = [
  "nextstep-data-v1",
  "fyf-data-v1",
  "nextstep_onboarding_complete",
  "nextstep_onboarding_data",
  "nextstep_onboarding_state",
  "nextstep_personalization_profile",
  "nextstep_personalization_flash"
];

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

function isEmptyValue(raw) {
  if (raw === null || raw === undefined || raw === "") return true;
  if (raw === "false") return true;
  const parsed = safeParse(raw);
  if (parsed === null) return false;
  if (typeof parsed === "boolean") return parsed === false;
  if (Array.isArray(parsed)) return parsed.length === 0;
  if (typeof parsed === "object") return Object.keys(parsed).length === 0;
  return false;
}

function mergeAppData(existingRaw, incomingRaw) {
  const existing = safeParse(existingRaw) ?? {};
  const incoming = safeParse(incomingRaw) ?? {};

  const merged = {
    ...incoming,
    ...existing,
    progress: { ...(incoming.progress ?? {}), ...(existing.progress ?? {}) },
    scores: { ...(incoming.scores ?? {}), ...(existing.scores ?? {}) },
    quizSessions: { ...(incoming.quizSessions ?? {}), ...(existing.quizSessions ?? {}) },
    quizResults: { ...(incoming.quizResults ?? {}), ...(existing.quizResults ?? {}) },
    favorites: [...(incoming.favorites ?? []), ...(existing.favorites ?? [])]
  };

  const dedupedFavorites = Array.from(
    new Map((merged.favorites ?? []).map((item) => [`${item.type}-${item.name}`, item])).values()
  );
  merged.favorites = dedupedFavorites;
  return safeStringify(merged);
}

export function migrateAnonymousProgressToUser(userId) {
  if (!userId) return;
  const marker = getScopedStorageKey("nextstep_migration_done", userId);
  if (localStorage.getItem(marker) === "true") return;

  migrationBases.forEach((baseKey) => {
    const anonymousKey = getAnonymousStorageKey(baseKey);
    const scopedKey = getScopedStorageKey(baseKey, userId);
    const anonymousValue = localStorage.getItem(anonymousKey);
    if (!anonymousValue) return;

    const existingScopedValue = localStorage.getItem(scopedKey);
    if (!existingScopedValue || isEmptyValue(existingScopedValue)) {
      localStorage.setItem(scopedKey, anonymousValue);
      return;
    }

    if (baseKey === "nextstep-data-v1" || baseKey === "fyf-data-v1") {
      const merged = mergeAppData(existingScopedValue, anonymousValue);
      if (merged) localStorage.setItem(scopedKey, merged);
      return;
    }

    if ((baseKey === "nextstep_onboarding_complete" || baseKey === "nextstep_onboarding_state") && existingScopedValue !== anonymousValue) {
      const scopedParsed = safeParse(existingScopedValue);
      const anonParsed = safeParse(anonymousValue);
      if (typeof scopedParsed === "boolean" && scopedParsed === false && anonParsed === true) {
        localStorage.setItem(scopedKey, anonymousValue);
      }
      if (typeof scopedParsed === "object" && scopedParsed && typeof anonParsed === "object" && anonParsed) {
        localStorage.setItem(scopedKey, JSON.stringify({ ...anonParsed, ...scopedParsed }));
      }
    }
  });

  localStorage.setItem(marker, "true");
}

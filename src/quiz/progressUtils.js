export function isResumableSession(session) {
  if (!session) return false;
  return ["in_progress", "review", "complete", "results"].includes(session.status);
}

export function getResumeMeta(session, estimatedSteps) {
  if (!session) return null;
  const currentStep = Math.max(1, (session.currentIndex ?? 0) + 1);
  const safeSteps = Math.max(estimatedSteps ?? 1, currentStep);
  const percent = Math.round((currentStep / safeSteps) * 100);
  return {
    currentStep,
    totalSteps: safeSteps,
    percent,
    status: session.status,
    updatedAtText: formatDateTime(session.updatedAt)
  };
}

function formatDateTime(value) {
  if (!value) return "just now";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "just now";
  return parsed.toLocaleString();
}

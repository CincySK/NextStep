export async function generateCareerFollowUpQuestion({ fallbackQuestion }) {
  // Future AI integration point:
  // Replace this local return with a server/API call when you re-enable AI.
  return {
    ok: true,
    source: "rule-based",
    data: fallbackQuestion,
    error: null
  };
}

export async function generateCareerSummary({ fallbackSynthesis }) {
  // Future AI integration point:
  // Replace with model-generated synthesis and explanation.
  return {
    ok: true,
    source: "rule-based",
    data: fallbackSynthesis,
    error: null
  };
}

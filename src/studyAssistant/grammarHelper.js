const IRREGULAR_FIXES = [
  { from: /\bgoed\b/gi, to: "went", note: 'The past tense of "go" is "went", not "goed".' },
  { from: /\bteached\b/gi, to: "taught", note: 'The past tense of "teach" is "taught".' },
  { from: /\bbringed\b/gi, to: "brought", note: 'The past tense of "bring" is "brought".' }
];

function normalizeSpacing(text) {
  return String(text ?? "").replace(/\s+/g, " ").trim();
}

function capitalizeFirst(text) {
  const trimmed = normalizeSpacing(text);
  if (!trimmed) return "";
  return trimmed[0].toUpperCase() + trimmed.slice(1);
}

export function looksLikeGrammarFixRequest(message) {
  const lower = String(message ?? "").toLowerCase().trim();
  return /\b(fix grammar|correct this sentence|improve this sentence|rewrite this sentence)\b/.test(lower)
    || /\bi\b/.test(lower);
}

export function fixGrammarSentence(message) {
  const raw = String(message ?? "");
  const directMatch = raw.match(/(?:improve|rewrite|fix|correct)\s+this\s+sentence:\s*(.+)$/i);
  const candidate = directMatch?.[1]?.trim() || raw.trim();
  if (!candidate) return null;

  let corrected = candidate;
  const notes = [];

  for (const rule of IRREGULAR_FIXES) {
    if (rule.from.test(corrected)) {
      corrected = corrected.replace(rule.from, rule.to);
      notes.push(rule.note);
    }
  }

  corrected = corrected
    .replace(/\bi\b/g, "I")
    .replace(/\bdont\b/gi, "don't")
    .replace(/\bcant\b/gi, "can't")
    .replace(/\bwont\b/gi, "won't");
  corrected = capitalizeFirst(corrected);
  if (!/[.!?]$/.test(corrected)) corrected = `${corrected}.`;

  return {
    text: [
      `Correct version: "${corrected}"`,
      `Explanation: ${notes[0] ?? "I fixed capitalization, verb form, and punctuation."}`
    ].join("\n")
  };
}

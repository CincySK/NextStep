function titleCaseSentence(text) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) return "";
  return trimmed[0].toUpperCase() + trimmed.slice(1);
}

function normalizePunctuation(text) {
  let out = String(text ?? "").replace(/\s+/g, " ").trim();
  out = out.replace(/\bi\b/g, "I");
  out = out.replace(/\bim\b/gi, "I'm");
  out = out.replace(/\bive\b/gi, "I've");
  out = out.replace(/\bi dont\b/gi, "I don't");
  out = out.replace(/\bi cant\b/gi, "I can't");
  out = out.replace(/\bi wont\b/gi, "I won't");
  out = out.replace(/\bdoesnt\b/gi, "doesn't");
  out = out.replace(/\bdont\b/gi, "don't");
  out = out.replace(/\bcant\b/gi, "can't");
  out = out.replace(/\bwont\b/gi, "won't");
  out = out.replace(/\bshouldnt\b/gi, "shouldn't");
  out = out.replace(/\bcouldnt\b/gi, "couldn't");
  out = out.replace(/\bwouldnt\b/gi, "wouldn't");
  out = out.replace(/\bthier\b/gi, "their");
  out = out.replace(/\bteh\b/gi, "the");
  out = out.replace(/\brecieve\b/gi, "receive");
  out = out.replace(/\bdefinately\b/gi, "definitely");
  out = out.replace(/\bseperate\b/gi, "separate");
  out = out.replace(/\bgoed\b/gi, "went");
  out = out.replace(/\ba lot of\b/gi, "many");
  return out;
}

function addEssayFlow(text) {
  return text
    .replace(/\bon the other hand\b/gi, "In contrast")
    .replace(/\bin conclusion\b/gi, "Overall")
    .replace(/\bfirst of all\b/gi, "First")
    .replace(/\bsecond of all\b/gi, "Second");
}

function fixCommonGrammar(line) {
  let text = normalizePunctuation(line);
  text = addEssayFlow(text);
  text = titleCaseSentence(text);
  if (!/[.!?]$/.test(text)) text = `${text}.`;
  return text;
}

function splitSentences(text) {
  return String(text ?? "")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function rewriteParagraph(text) {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return "";
  return sentences.map((sentence) => fixCommonGrammar(sentence)).join(" ");
}

function extractAfterPrompt(message, pattern) {
  const match = String(message ?? "").match(pattern);
  return match?.[1]?.trim() || "";
}

function improveSentenceRequest(message) {
  const original = extractAfterPrompt(message, /(?:improve|rewrite|fix)\s+this\s+sentence:\s*(.+)$/i);
  if (!original) return null;
  const revised = fixCommonGrammar(original);
  return {
    text: [
      `Original: ${original}`,
      `Improved: ${revised}`,
      "Why: I corrected grammar and made the sentence clearer."
    ].join("\n")
  };
}

function improveParagraphRequest(message) {
  const original = extractAfterPrompt(message, /(?:improve|rewrite|fix)\s+this\s+paragraph:\s*([\s\S]+)$/i);
  if (!original) return null;
  const revised = rewriteParagraph(original);
  return {
    text: [
      "Rewritten paragraph:",
      revised || original,
      "Why: I improved grammar, punctuation, and flow while keeping your idea."
    ].join("\n")
  };
}

function rewriteEssayDraftRequest(message) {
  const direct = extractAfterPrompt(message, /(?:rewrite|improve|fix)\s+my\s+essay:\s*([\s\S]+)$/i);
  const alt = extractAfterPrompt(message, /(?:rewrite|improve|fix)\s+this\s+essay:\s*([\s\S]+)$/i);
  const pasted = extractAfterPrompt(message, /(?:rewrite|improve|fix)\s+essay:\s*([\s\S]+)$/i);
  const original = direct || alt || pasted;
  if (!original) return null;
  const revised = rewriteParagraph(original);
  return {
    text: [
      "Rewritten essay draft:",
      revised || original,
      "Upgrade tip: use one clear claim per paragraph, then add one specific example."
    ].join("\n")
  };
}

function generalRewriteIntent(message) {
  const text = String(message ?? "").trim();
  if (!/(rewrite|improve|fix|edit)/i.test(text)) return null;

  const colonIdx = text.indexOf(":");
  const candidate = colonIdx >= 0 ? text.slice(colonIdx + 1).trim() : "";
  if (candidate.length < 12) return null;

  const revised = rewriteParagraph(candidate);
  return {
    text: [
      "Edited version:",
      revised || candidate,
      "Why: I tightened wording and corrected grammar for a clearer academic style."
    ].join("\n")
  };
}

function essayStarterRequest(message) {
  const match = String(message ?? "").match(/essay about\s+(.+)$/i);
  if (!match) return null;
  const topic = match[1].trim().replace(/[?.!]$/, "");
  return {
    text: [
      `Essay starter for "${topic}":`,
      `Hook: ${topic} affects people more than many students realize.`,
      `Thesis: This essay explains what ${topic} is, why it matters, and practical steps to improve outcomes.`,
      "Body plan: 1) context, 2) key evidence, 3) solutions and reflection."
    ].join("\n")
  };
}

export function handleWritingHelp(message) {
  return improveSentenceRequest(message)
    ?? improveParagraphRequest(message)
    ?? rewriteEssayDraftRequest(message)
    ?? generalRewriteIntent(message)
    ?? essayStarterRequest(message)
    ?? {
      text: "Paste your sentence, paragraph, or essay and tell me the goal (grammar, clarity, tone, or structure). I will rewrite it and explain the changes."
    };
}

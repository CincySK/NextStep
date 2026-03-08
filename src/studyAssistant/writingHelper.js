function normalize(text) {
  return String(text ?? "").replace(/\s+/g, " ").trim();
}

function capitalize(text) {
  const cleaned = normalize(text);
  if (!cleaned) return "";
  return cleaned[0].toUpperCase() + cleaned.slice(1);
}

function fixLine(line) {
  let value = normalize(line);
  value = value
    .replace(/\bi\b/g, "I")
    .replace(/\bdont\b/gi, "don't")
    .replace(/\bcant\b/gi, "can't")
    .replace(/\bwont\b/gi, "won't")
    .replace(/\bim\b/gi, "I'm")
    .replace(/\bive\b/gi, "I've")
    .replace(/\bteh\b/gi, "the")
    .replace(/\bthier\b/gi, "their");
  value = capitalize(value);
  if (value && !/[.!?]$/.test(value)) value = `${value}.`;
  return value;
}

function splitParagraph(text) {
  return String(text ?? "")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function improveWritingSample(message) {
  const raw = String(message ?? "");
  const match = raw.match(/(?:improve|rewrite|edit|fix)\s+(?:this|my)?\s*(?:sentence|paragraph|essay|writing)?\s*:?\s*([\s\S]+)$/i);
  const content = match?.[1]?.trim() || "";
  if (!content) {
    return {
      text: "Paste your sentence or paragraph and I will rewrite it for grammar and clarity."
    };
  }

  const lines = splitParagraph(content);
  const rewritten = lines.length > 1
    ? lines.map((line) => fixLine(line)).join(" ")
    : fixLine(content);

  return {
    text: [
      "Rewritten version:",
      rewritten || content,
      "Why this is better: cleaner grammar, clearer wording, and smoother flow."
    ].join("\n")
  };
}

function extractEssayTopic(message) {
  const lower = String(message ?? "").toLowerCase();
  const fromAbout = lower.match(/essay about\s+(.+)$/i);
  if (fromAbout) return fromAbout[1].replace(/[?.!]$/, "").trim();
  return "your topic";
}

export function buildEssayStructureResponse(message) {
  const topic = extractEssayTopic(message);
  return {
    text: [
      `Essay structure plan for "${topic}":`,
      "1. Thesis: one clear claim about your main argument.",
      `2. Body paragraph 1: first reason + one specific example related to ${topic}.`,
      "3. Body paragraph 2: second reason + evidence or data.",
      "4. Body paragraph 3 (optional): counterpoint and response.",
      "5. Conclusion: restate the thesis and end with one practical takeaway.",
      "",
      "Starter thesis template:",
      `"${capitalize(topic)} matters because [reason 1] and [reason 2], so [recommended action or conclusion]."`
    ].join("\n")
  };
}

export function handleWritingHelp(message) {
  const lower = String(message ?? "").toLowerCase();
  if (/\bessay\b/.test(lower) && /\b(thesis|outline|structure|start|introduction|conclusion)\b/.test(lower)) {
    return buildEssayStructureResponse(message);
  }
  return improveWritingSample(message);
}

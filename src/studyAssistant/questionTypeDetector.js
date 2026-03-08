function lower(value) {
  return String(value ?? "").toLowerCase().trim();
}

function hasMathShape(text) {
  return /^-?\d+(\.\d+)?\s*([+\-*/]\s*-?\d+(\.\d+)?)+$/.test(text.replace(/\s+/g, ""))
    || /^-?\d+\s*\/\s*-?\d+$/.test(text)
    || /^-?\d+(\.\d+)?$/.test(text)
    || /\b\d+%(\s+of\s+\d+)?\b/.test(text)
    || /\b\d+(\.\d+)?\s+divided by\s+\d+(\.\d+)?\b/.test(text)
    || /\bas a fraction\b/.test(text)
    || /\bsolve\b/.test(text)
    || /\bsimplify\b/.test(text);
}

function hasAlgebra(text) {
  return /x/.test(text) && /=/.test(text) && /\d/.test(text);
}

export function detectQuestionType(message, recentHistory = [], useClassContext = true) {
  const text = lower(message);
  const trimmed = text.trim();
  const lastAssistant = [...recentHistory].reverse().find((item) => item.role === "assistant");
  const lastTag = lastAssistant?.context?.assistantTag ?? "";

  if (!trimmed || trimmed === "help") return "unclear";
  if (/^i don't get it|i dont get it$/i.test(trimmed)) return "unclear";

  if (/(improve|rewrite|fix|edit).*(sentence|paragraph|essay)|\bgrammar\b|\bthesis\b|\bintroduction\b|\bconclusion\b/.test(trimmed)) {
    return "writing";
  }

  if (hasAlgebra(trimmed)) return "algebra";
  if (hasMathShape(trimmed)) return "basic_math";
  if (/what is \d+\/\d+/.test(trimmed)) return "basic_math";
  if (/what is|explain\b|define\b/.test(trimmed) && /photosynthesis|gravity|concept|mean/.test(trimmed)) {
    return "concept";
  }

  if (useClassContext && /question\s*\d+[a-z]?|problem\s*\d+[a-z]?|worksheet|assignment|class/i.test(trimmed)) {
    return "class";
  }

  if (/^\d+$/.test(trimmed) && /Math Help|Algebra Help|Clarification/.test(lastTag)) return "basic_math";
  if (/study|test prep|quiz/.test(trimmed)) return "study";
  return "unclear";
}

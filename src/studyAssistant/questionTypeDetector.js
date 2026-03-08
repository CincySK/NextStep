function normalize(value) {
  return String(value ?? "").toLowerCase().trim();
}

function isHomeworkReference(text) {
  return /(?:question|problem|worksheet|assignment|classwork|homework)\s*\d*[a-z]?/i.test(text)
    || /\bfrom my worksheet\b/i.test(text)
    || /\bfrom my assignment\b/i.test(text);
}

function isAlgebra(text) {
  return /\bx\b/.test(text) && /=/.test(text) && /\d/.test(text);
}

function isFractionDecimalPercent(text) {
  return /^-?\d+\s*\/\s*-?\d+$/.test(text)
    || /\bsimplify\s*-?\d+\s*\/\s*-?\d+/.test(text)
    || /\b\d+(\.\d+)?\s*(as a fraction|to fraction)\b/.test(text)
    || /\b\d+(\.\d+)?%\s*(of\s*-?\d+(\.\d+)?)?\b/.test(text);
}

function isBasicArithmetic(text) {
  const compact = text.replace(/\s+/g, "");
  return /^-?\d+(\.\d+)?([+\-*/]-?\d+(\.\d+)?)+$/.test(compact)
    || /\b-?\d+(\.\d+)?\s*(plus|minus|times|multiplied by|divided by)\s*-?\d+(\.\d+)?\b/.test(text);
}

function isScienceConcept(text) {
  return /(photosynthesis|gravity|ecosystem|ecosystems|atom|atoms|energy|evaporation|cell|cells|respiration|food chain|water cycle)/.test(text)
    && /(^explain\b|^what is\b|^define\b|simply|in simple terms|\?)/.test(text);
}

function isGrammarFix(text) {
  return /\bfix grammar\b|\bgrammar fix\b|\bcorrect this sentence\b|\bimprove this sentence\b|\brewrite this sentence\b/.test(text);
}

function looksLikeRawSentenceNeedingGrammar(text) {
  return /\b(i|he|she|they|we)\b/.test(text)
    && /\b(goed|dont|cant|wont|teached|bringed)\b/.test(text)
    && !/[=/*+%-]/.test(text);
}

function isEssayStructure(text) {
  return /\bessay\b/.test(text) && /\b(thesis|outline|structure|intro|introduction|body paragraph|conclusion|start)\b/.test(text);
}

function isWritingHelp(text) {
  return /(improve|rewrite|edit|fix)\s+.*(paragraph|essay|writing|sentence)/.test(text)
    || /\bproofread\b|\bclarity\b|\bmake this better\b/.test(text);
}

export function detectQuestionType(message, recentHistory = [], useClassContext = true) {
  const text = normalize(message);
  const lastAssistant = [...recentHistory].reverse().find((item) => item.role === "assistant");
  const lastTag = String(lastAssistant?.context?.assistantTag ?? "");

  if (!text) return "unclear";
  if (text === "help") return "study_help";
  if (/^i don't get it$|^i dont get it$/.test(text)) return "unclear";

  if (useClassContext && isHomeworkReference(text) && !isBasicArithmetic(text) && !isFractionDecimalPercent(text)) {
    return "homework_reference";
  }

  if (isGrammarFix(text)) return "grammar_fix";
  if (looksLikeRawSentenceNeedingGrammar(text)) return "grammar_fix";
  if (isEssayStructure(text)) return "essay_structure";
  if (isWritingHelp(text)) return "writing_help";

  if (isAlgebra(text)) return "math_algebra";
  if (isFractionDecimalPercent(text)) return "fractions_decimals_percent";
  if (isBasicArithmetic(text)) return "math_basic";

  if (isScienceConcept(text)) return "science_concept";
  if (/^what is\s+\d+\s*\/\s*\d+/.test(text)) return "fractions_decimals_percent";
  if (/study|test prep|quiz|how do i study/.test(text)) return "study_help";

  if (/^\d+$/.test(text)) {
    if (/Math Help|Algebra Help|Fraction Help|Clarification/.test(lastTag)) return "math_basic";
    if (/Class Context/.test(lastTag)) return "homework_reference";
    return "unclear";
  }

  return "unclear";
}

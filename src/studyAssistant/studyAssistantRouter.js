import { explainFractionDecimalPercent, handleBasicMath, inferFollowUpMath } from "./mathHelper";
import { solveSimpleAlgebra } from "./algebraHelper";
import { explainScienceConcept } from "./scienceConceptHelper";
import { fixGrammarSentence } from "./grammarHelper";
import { buildEssayStructureResponse, handleWritingHelp } from "./writingHelper";
import { resolveHomeworkReference } from "./classContextResolver";
import { buildClarifyingQuestion } from "./clarificationHelper";
import { detectQuestionType } from "./questionTypeDetector";

function buildStudyHelp() {
  return {
    text: [
      "Quick study plan:",
      "1. Review notes for 20 minutes",
      "2. Solve 3-5 practice questions",
      "3. Check mistakes and fix patterns",
      "4. Do a short self-quiz without notes"
    ].join("\n"),
    assistantTag: "Study Help"
  };
}

function normalize(message) {
  return String(message ?? "").trim();
}

export function handleStudyQuestion({
  message,
  recentHistory = [],
  useClassContext = true,
  context
}) {
  const raw = normalize(message);
  const lower = raw.toLowerCase();

  if (raw === "5/10") {
    const result = handleBasicMath(raw);
    if (result) return { ...result, assistantTag: "Math Help" };
  }

  if (/^explain\s+5\/10$/i.test(raw)) {
    const result = handleBasicMath("5/10");
    if (result) return { ...result, assistantTag: "Math Help" };
  }

  if (lower === "help") {
    return {
      text: "Try one of these: \"5/10\", \"solve 2x + 3 = 11\", \"improve this sentence: ...\", or \"help with question 4a\".",
      assistantTag: "Clarification"
    };
  }

  const followUpMath = inferFollowUpMath(message, recentHistory);
  if (followUpMath) {
    return { ...followUpMath, assistantTag: "Fraction Help" };
  }

  const type = detectQuestionType(message, recentHistory, useClassContext);

  if (type === "fractions_decimals_percent") {
    const result = explainFractionDecimalPercent(message);
    if (result) return { ...result, assistantTag: "Fraction Help" };
  }

  if (type === "math_basic") {
    const result = handleBasicMath(message);
    if (result) return { ...result, assistantTag: "Math Help" };
  }

  if (type === "math_algebra") {
    const result = solveSimpleAlgebra(message);
    if (result) return { ...result, assistantTag: "Algebra Help" };
  }

  if (type === "grammar_fix") {
    const result = fixGrammarSentence(message);
    if (result) return { ...result, assistantTag: "Grammar Fix" };
  }

  if (type === "essay_structure") {
    const result = buildEssayStructureResponse(message);
    if (result) return { ...result, assistantTag: "Essay Structure" };
  }

  if (type === "writing_help") {
    const result = handleWritingHelp(message);
    return { ...result, assistantTag: "Writing Help" };
  }

  if (type === "science_concept") {
    const result = explainScienceConcept(message);
    return { ...result, assistantTag: "Science Concept" };
  }

  if (type === "homework_reference") {
    const result = resolveHomeworkReference({ message, context });
    return { ...result, assistantTag: "Class Context" };
  }

  if (type === "study_help") {
    return buildStudyHelp();
  }

  return {
    text: buildClarifyingQuestion(message, recentHistory),
    assistantTag: "Clarification"
  };
}

export function routeLocalAssistant(input) {
  return handleStudyQuestion(input);
}

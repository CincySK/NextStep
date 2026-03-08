import { handleAlgebra, handleBasicMath, inferFollowUpMath } from "./mathHelper";
import { handleWritingHelp } from "./writingHelper";
import { handleConceptExplanation } from "./conceptHelper";
import { resolveClassQuestion } from "./classContextResolver";
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

export function routeLocalAssistant({
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
    return { ...followUpMath, assistantTag: "Math Help" };
  }

  const type = detectQuestionType(message, recentHistory, useClassContext);

  if (type === "basic_math") {
    const result = handleBasicMath(message);
    if (result) return { ...result, assistantTag: "Math Help" };
  }

  if (type === "algebra") {
    const result = handleAlgebra(message);
    if (result) return { ...result, assistantTag: "Algebra Help" };
  }

  if (type === "writing") {
    const result = handleWritingHelp(message);
    return { ...result, assistantTag: "Writing Help" };
  }

  if (type === "concept") {
    const result = handleConceptExplanation(message);
    return { ...result, assistantTag: "Concept Help" };
  }

  if (type === "class") {
    const result = resolveClassQuestion({ message, context });
    return { ...result, assistantTag: "Class Context" };
  }

  if (type === "study") {
    return buildStudyHelp();
  }

  return {
    text: buildClarifyingQuestion(message, recentHistory),
    assistantTag: "Clarification"
  };
}

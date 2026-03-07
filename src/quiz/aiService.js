import {
  generateCareerSummary,
  generateCollegeSummary,
  generateNextCareerQuestion,
  generateNextCollegeQuestion,
  generateRecommendationExplanation
} from "./aiAdapters";

const defaultAdapter = {
  getNextQuestion(params) {
    if (params.quizType === "career") {
      return generateNextCareerQuestion(params.answerHistory, params);
    }
    return generateNextCollegeQuestion(params.answerHistory, params);
  },
  getSummary(params) {
    if (params.quizType === "career") {
      return generateCareerSummary(params.answerHistory);
    }
    return generateCollegeSummary(params.answerHistory);
  },
  getRecommendationExplanation(params) {
    return generateRecommendationExplanation(params);
  }
};

let activeAdapter = defaultAdapter;

export function setQuizAIAdapter(adapter) {
  // Integration point:
  // Inject a real AI adapter here (API-backed) with the same method signatures.
  if (!adapter) {
    activeAdapter = defaultAdapter;
    return;
  }
  activeAdapter = {
    ...defaultAdapter,
    ...adapter
  };
}

export function getQuizAIAdapter() {
  return activeAdapter;
}

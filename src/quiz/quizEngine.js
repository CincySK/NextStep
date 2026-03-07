import { getQuizAIAdapter } from "./aiService";
import { careerQuestionBank, collegeQuestionBank } from "./questionBank";

const bankByType = {
  career: careerQuestionBank,
  college: collegeQuestionBank
};

function buildAnswerHistory(type, questionOrder, answers) {
  const bank = bankByType[type];
  return questionOrder
    .filter((id) => answers[id])
    .map((id) => {
      const question = bank.questions[id];
      const option = question.options.find((opt) => opt.value === answers[id]);
      return {
        id,
        question: question.title,
        value: answers[id],
        answer: option?.label ?? answers[id]
      };
    });
}

export function getQuizDefinition(type) {
  return bankByType[type];
}

export function getQuestion(type, id) {
  return bankByType[type].questions[id];
}

export function getStartQuestionId(type) {
  return bankByType[type].startId;
}

export function getEstimatedSteps(type) {
  return bankByType[type].estimatedSteps;
}

export function createNewQuizSession(type) {
  const startId = getStartQuestionId(type);
  return {
    quizType: type,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentIndex: 0,
    questionOrder: [startId],
    answers: {},
    status: "in_progress",
    result: null
  };
}

export function getNextQuestionId(type, currentQuestionId, answers, questionOrder) {
  const question = getQuestion(type, currentQuestionId);
  const ruleBasedNextQuestionId = typeof question.next === "function" ? question.next(answers) : question.next ?? null;
  const answerHistory = buildAnswerHistory(type, questionOrder, answers);
  const availableQuestionIds = Object.keys(bankByType[type].questions).filter((id) => !questionOrder.includes(id));
  const adapter = getQuizAIAdapter();
  return adapter.getNextQuestion({
    quizType: type,
    currentQuestionId,
    answerHistory,
    answers,
    questionOrder,
    availableQuestionIds,
    ruleBasedNextQuestionId
  });
}

export function generateResult(type, answers, questionOrder) {
  const answerHistory = buildAnswerHistory(type, questionOrder, answers);
  const adapter = getQuizAIAdapter();
  const summary = adapter.getSummary({
    quizType: type,
    answerHistory,
    answers,
    questionOrder
  });
  const recommendationExplanation = adapter.getRecommendationExplanation({
    quizType: type,
    summary,
    answerHistory
  });
  return {
    ...summary,
    recommendationExplanation
  };
}

export function getAnswerHistory(type, answers, questionOrder) {
  return buildAnswerHistory(type, questionOrder, answers);
}

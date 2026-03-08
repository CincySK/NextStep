import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/quiz/ProgressBar";
import QuizNavigation from "../components/quiz/QuizNavigation";
import CareerReport from "../components/quiz/career-report/CareerReport";
import { careerBaseQuestions, getDefaultCareerFollowUp } from "../quiz/career/careerQuestionFlow";
import { analyzeCareerAnswerHistory, scoreCareerMatches, validateCareerRecommendations } from "../quiz/career/careerScoring";
import { buildCareerResultsSummary } from "../quiz/career/careerResultsBuilder";
import { generateCareerFollowUpQuestion } from "../services/aiCareerService";
import { finalizeFirstQuizPersonalization } from "../personalization/profileLifecycle";
import { loadQuizSession, saveQuizSession, updateAppData } from "../storage";

const CAREER_SESSION_VERSION = 2;

function toQuestionMap(questions) {
  return Object.fromEntries(questions.map((question) => [question.id, question]));
}

function createInitialSession() {
  return {
    version: CAREER_SESSION_VERSION,
    quizType: "career",
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "in_progress",
    currentIndex: 0,
    questionOrder: careerBaseQuestions.map((q) => q.id),
    dynamicQuestions: {},
    answers: {},
    report: null
  };
}

function loadOrCreateSession() {
  const saved = loadQuizSession("career");
  if (!saved || saved.version !== CAREER_SESSION_VERSION) return createInitialSession();
  return saved;
}

function isAnswered(question, value) {
  if (!question) return false;
  if (question.kind === "text") return Boolean((value ?? "").trim());
  return Boolean(value);
}

function buildAnswerHistoryFromSession(targetSession, questionMap) {
  return targetSession.questionOrder
    .filter((id) => targetSession.answers[id] !== undefined && targetSession.answers[id] !== "")
    .map((id) => {
      const question = questionMap[id];
      const rawValue = targetSession.answers[id];
      const answerLabel = question.kind === "choice"
        ? (question.options.find((opt) => opt.value === rawValue)?.label ?? rawValue)
        : rawValue;
      return {
        id,
        question: question.title,
        value: rawValue,
        answer: answerLabel
      };
    });
}

export default function CareerQuiz() {
  const navigate = useNavigate();
  const [session, setSession] = useState(loadOrCreateSession);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [compareSelection, setCompareSelection] = useState([]);

  const questionMap = useMemo(
    () => ({
      ...toQuestionMap(careerBaseQuestions),
      ...session.dynamicQuestions
    }),
    [session.dynamicQuestions]
  );

  const currentQuestionId = session.questionOrder[session.currentIndex];
  const currentQuestion = questionMap[currentQuestionId];
  const currentValue = session.answers[currentQuestionId] ?? "";

  const answerHistory = useMemo(
    () => buildAnswerHistoryFromSession(session, questionMap),
    [questionMap, session.answers, session.questionOrder]
  );

  const progressTotal = session.questionOrder.length;
  const progressCurrent = Math.min(session.currentIndex + 1, progressTotal);
  const canGoNext = isAnswered(currentQuestion, currentValue) && !busy;

  function persist(next) {
    const withTimestamp = { ...next, updatedAt: new Date().toISOString() };
    saveQuizSession("career", withTimestamp);
    setSession(withTimestamp);
  }

  function updateAnswer(value) {
    persist({
      ...session,
      answers: {
        ...session.answers,
        [currentQuestionId]: value
      }
    });
  }

  async function maybeInjectAdaptiveFollowUp(nextSession) {
    const hasFollowUp = nextSession.questionOrder.some((id) => id.startsWith("ai_followup_"));
    if (hasFollowUp) return nextSession;

    const baseComplete = careerBaseQuestions.every((question) => isAnswered(question, nextSession.answers[question.id]));
    if (!baseComplete) return nextSession;

    const nextHistory = buildAnswerHistoryFromSession(
      nextSession,
      {
        ...toQuestionMap(careerBaseQuestions),
        ...nextSession.dynamicQuestions
      }
    );
    const analysis = analyzeCareerAnswerHistory(
      nextHistory,
      {
        ...toQuestionMap(careerBaseQuestions),
        ...nextSession.dynamicQuestions
      }
    );
    const fallbackQuestion = getDefaultCareerFollowUp(analysis);
    const aiFollowUp = await generateCareerFollowUpQuestion({ fallbackQuestion });
    const generated = aiFollowUp.data ?? fallbackQuestion;
    const followUpId = `ai_followup_${Date.now()}`;
    const followUpQuestion = {
      ...generated,
      id: followUpId,
      stage: "adaptive",
      kind: "choice"
    };

    return {
      ...nextSession,
      questionOrder: [...nextSession.questionOrder, followUpId],
      dynamicQuestions: {
        ...nextSession.dynamicQuestions,
        [followUpId]: followUpQuestion
      }
    };
  }

  async function completeQuiz(nextSession) {
    const nextHistory = buildAnswerHistoryFromSession(
      nextSession,
      {
        ...toQuestionMap(careerBaseQuestions),
        ...nextSession.dynamicQuestions
      }
    );
    const analysis = analyzeCareerAnswerHistory(
      nextHistory,
      {
        ...toQuestionMap(careerBaseQuestions),
        ...nextSession.dynamicQuestions
      }
    );
    const ranked = scoreCareerMatches(analysis);
    const { recommendations, excluded } = validateCareerRecommendations(analysis, ranked, 4);
    const report = await buildCareerResultsSummary({
      answerHistory: nextHistory,
      analysis,
      recommendations,
      excluded
    });

    const finalized = {
      ...nextSession,
      status: "results",
      report
    };

    persist(finalized);

    updateAppData((current) => {
      const previous = current.quizResults?.careerHistory ?? [];
      const snapshot = {
        createdAt: report.generatedAt,
        topDomain: report.topDomain,
        topCareerTitles: report.researchCards.map((item) => item.title)
      };
      return {
        ...current,
        progress: { ...current.progress, careerComplete: true },
        scores: { ...current.scores, career: report.researchCards[0]?.title ?? "Career exploration complete" },
        quizResults: {
          ...current.quizResults,
          career: {
            ...report,
            completedAt: report.generatedAt
          },
          careerHistory: [snapshot, ...previous].slice(0, 10)
        }
      };
    });

    finalizeFirstQuizPersonalization({
      quizType: "career",
      answers: nextSession.answers,
      result: report
    });
  }

  async function handleNext() {
    if (!canGoNext) return;
    setError("");

    if (session.currentIndex < session.questionOrder.length - 1) {
      persist({ ...session, currentIndex: session.currentIndex + 1 });
      return;
    }

    try {
      setBusy(true);
      const updated = await maybeInjectAdaptiveFollowUp(session);

      if (updated.questionOrder.length > session.questionOrder.length) {
        persist({
          ...updated,
          currentIndex: updated.questionOrder.length - 1
        });
        return;
      }

      persist({ ...updated, status: "review" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue quiz.");
    } finally {
      setBusy(false);
    }
  }

  function handleBack() {
    if (busy) return;
    if (session.status === "review") {
      persist({ ...session, status: "in_progress", currentIndex: session.questionOrder.length - 1 });
      return;
    }
    if (session.currentIndex === 0) {
      navigate("/career");
      return;
    }
    persist({ ...session, currentIndex: session.currentIndex - 1 });
  }

  async function handleSubmit() {
    try {
      setBusy(true);
      await completeQuiz(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate results.");
    } finally {
      setBusy(false);
    }
  }

  function startOver() {
    const fresh = createInitialSession();
    saveQuizSession("career", fresh);
    setSession(fresh);
    setCompareSelection([]);
  }

  function toggleCompare(careerId) {
    setCompareSelection((prev) => {
      if (prev.includes(careerId)) return prev.filter((id) => id !== careerId);
      if (prev.length === 2) return [prev[1], careerId];
      return [...prev, careerId];
    });
  }

  const compareCards = session.report
    ? session.report.researchCards.filter((card) => compareSelection.includes(card.id))
    : [];

  return (
    <section className={`quiz-flow-shell ${session.status === "results" ? "career-report-shell" : ""}`}>
      <header className="quiz-flow-top">
        <p className="quiz-flow-label">Career Exploration Quiz</p>
        <h1>Career Exploration: Important Steps</h1>
        <p>
          We start with your interests, values, and strengths. Then we ask adaptive follow-up questions and build
          grounded recommendations you can research and revisit over time.
        </p>
        <p className="quiz-meta">Progress is auto-saved. You can leave and resume anytime.</p>
      </header>

      {session.status === "in_progress" && currentQuestion && (
        <>
          <ProgressBar
            currentStep={progressCurrent}
            totalSteps={progressTotal}
            label="Career Quiz Progress"
          />
          <article key={currentQuestion.id} className="quiz-flow-card quiz-stage">
            <p className="quiz-flow-label">Step {progressCurrent}</p>
            <h2>{currentQuestion.title}</h2>
            {currentQuestion.helper && <p className="intro-copy">{currentQuestion.helper}</p>}
            {currentQuestion.kind === "choice" && (
              <div className="quiz-choice-grid">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    className={`quiz-choice ${currentValue === option.value ? "quiz-choice-selected" : ""}`}
                    onClick={() => updateAnswer(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            {currentQuestion.kind === "text" && (
              <textarea
                className="quiz-text-input"
                placeholder={currentQuestion.placeholder ?? "Type your answer"}
                value={currentValue}
                onChange={(event) => updateAnswer(event.target.value)}
              />
            )}
          </article>
          <QuizNavigation
            canGoBack
            canGoNext={canGoNext}
            nextLabel={busy ? "Thinking..." : "Next"}
            onBack={handleBack}
            onNext={handleNext}
          />
        </>
      )}

      {session.status === "review" && (
        <section className="quiz-results-card">
          <p className="quiz-flow-label">Review</p>
          <h2>Check your answers before finalizing</h2>
          <div className="quiz-review-list">
            {answerHistory.map((entry) => (
              <article key={entry.id} className="quiz-review-item">
                <h4>{entry.question}</h4>
                <p>{entry.answer}</p>
              </article>
            ))}
          </div>
          <QuizNavigation
            canGoBack
            canGoNext={!busy}
            nextLabel={busy ? "Generating..." : "Generate My Career Report"}
            onBack={handleBack}
            onNext={handleSubmit}
          />
        </section>
      )}

      {session.status === "results" && session.report && (
        <CareerReport
          report={session.report}
          compareCards={compareCards}
          compareSelection={compareSelection}
          onToggleCompare={toggleCompare}
          onRetake={startOver}
          onExploreCollege={() => navigate("/college")}
          onGoDashboard={() => navigate("/dashboard")}
        />
      )}

      {error && <p className="feedback">{error}</p>}
    </section>
  );
}

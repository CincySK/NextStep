import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import QuizNavigation from "./QuizNavigation";
import ResultsSummary from "./ResultsSummary";
import {
  createNewQuizSession,
  generateResult,
  getAnswerHistory,
  getEstimatedSteps,
  getNextQuestionId,
  getQuestion
} from "../../quiz/quizEngine";
import { finalizeFirstQuizPersonalization } from "../../personalization/profileLifecycle";
import { loadPersonalizationProfile } from "../../personalization/personalizationStorage";
import { clearQuizSession, loadQuizSession, saveQuizSession, updateAppData } from "../../storage";
import { getResumeMeta } from "../../quiz/progressUtils";

function getQuizMeta(type) {
  if (type === "career") {
    return {
      label: "Career Quiz",
      intro: "You will get tailored follow-up questions based on your answers."
    };
  }
  return {
    label: "College Match Quiz",
    intro: "This guided flow adapts to your priorities to produce a better college fit summary."
  };
}

export default function QuizFlowPage({ type }) {
  const navigate = useNavigate();
  const meta = getQuizMeta(type);
  const [session, setSession] = useState(() => loadQuizSession(type) ?? createNewQuizSession(type));

  const totalSteps = getEstimatedSteps(type);
  const currentQuestionId = session.questionOrder[session.currentIndex];
  const currentQuestion = session.status === "in_progress" ? getQuestion(type, currentQuestionId) : null;
  const selectedValue = currentQuestion ? session.answers[currentQuestion.id] : null;

  const answerHistory = useMemo(
    () => getAnswerHistory(type, session.answers, session.questionOrder),
    [session.answers, session.questionOrder, type]
  );
  const resumeMeta = useMemo(
    () => getResumeMeta(session, totalSteps),
    [session, totalSteps]
  );
  const willEndAfterCurrent = useMemo(() => {
    if (!currentQuestion || !selectedValue) return false;
    const projectedAnswers = { ...session.answers, [currentQuestion.id]: selectedValue };
    const projectedNext = getNextQuestionId(type, currentQuestion.id, projectedAnswers, session.questionOrder);
    return !projectedNext;
  }, [currentQuestion, selectedValue, session.answers, session.questionOrder, type]);

  const activeProfile = loadPersonalizationProfile();
  const dashboardLabel = activeProfile?.primaryPath === type
    ? "Go to My Personalized Dashboard"
    : "Go to Dashboard";

  function persist(nextSession) {
    saveQuizSession(type, nextSession);
    setSession(nextSession);
  }

  function handleSelect(value) {
    const nextSession = {
      ...session,
      answers: { ...session.answers, [currentQuestion.id]: value },
      updatedAt: new Date().toISOString()
    };
    persist(nextSession);
  }

  function handleBack() {
    if (session.status === "review") {
      persist({ ...session, status: "in_progress", currentIndex: session.questionOrder.length - 1 });
      return;
    }
    if (session.status === "complete") {
      persist({ ...session, status: "review" });
      return;
    }
    if (session.currentIndex === 0) {
      navigate(type === "career" ? "/career" : "/college");
      return;
    }
    persist({
      ...session,
      currentIndex: session.currentIndex - 1,
      updatedAt: new Date().toISOString()
    });
  }

  function handleNext() {
    if (!currentQuestion || !selectedValue) return;
    const nextQuestionId = getNextQuestionId(type, currentQuestion.id, session.answers, session.questionOrder);

    if (!nextQuestionId) {
      persist({
        ...session,
        status: "review",
        updatedAt: new Date().toISOString()
      });
      return;
    }

    const nextOrder = [...session.questionOrder.slice(0, session.currentIndex + 1), nextQuestionId];
    persist({
      ...session,
      questionOrder: nextOrder,
      currentIndex: session.currentIndex + 1,
      status: "in_progress",
      updatedAt: new Date().toISOString()
    });
  }

  function submitQuiz() {
    const result = generateResult(type, session.answers, session.questionOrder);
    const isCareer = type === "career";
    const scoreKey = isCareer ? "career" : "college";
    const progressKey = isCareer ? "careerComplete" : "collegeComplete";

    updateAppData((current) => ({
      ...current,
      progress: { ...current.progress, [progressKey]: true },
      scores: { ...current.scores, [scoreKey]: result.title },
      quizResults: {
        ...current.quizResults,
        [type]: {
          ...result,
          completedAt: new Date().toISOString()
        }
      }
    }));

    finalizeFirstQuizPersonalization({
      quizType: type,
      answers: session.answers,
      result
    });

    persist({
      ...session,
      status: "complete",
      result,
      updatedAt: new Date().toISOString()
    });
  }

  function showResults() {
    persist({
      ...session,
      status: "results",
      updatedAt: new Date().toISOString()
    });
  }

  function startOver() {
    clearQuizSession(type);
    const fresh = createNewQuizSession(type);
    saveQuizSession(type, fresh);
    setSession(fresh);
  }

  return (
    <section className="quiz-flow-shell premium-quiz-shell">
      <header className="quiz-flow-top premium-quiz-hero">
        <div>
          <p className="quiz-flow-label">{meta.label}</p>
          <h1>{meta.label}</h1>
          <p>{meta.intro}</p>
          <p className="quiz-meta">
            Your progress is auto-saved. {resumeMeta.percent}% complete, last updated {resumeMeta.updatedAtText}.
          </p>
        </div>
        <aside className="premium-quiz-sidecard">
          <p className="quiz-flow-label">Program guide</p>
          <h3>{type === "career" ? "Adaptive career fit flow" : "College fit profile"}</h3>
          <p>
            {type === "career"
              ? "This quiz builds from your priorities into tailored follow-up questions and grounded recommendations."
              : "This flow helps you move from preferences to a college-fit summary you can act on."}
          </p>
          <span className="status-chip status-active">{resumeMeta.currentStep}/{resumeMeta.totalSteps} steps</span>
        </aside>
      </header>

      {session.status === "in_progress" && currentQuestion && (
        <>
          <ProgressBar
            currentStep={resumeMeta.currentStep}
            totalSteps={resumeMeta.totalSteps}
            label="Question Progress"
          />
          <div key={currentQuestion.id} className="quiz-stage premium-quiz-stage">
            <QuestionCard question={currentQuestion} selectedValue={selectedValue} onSelect={handleSelect} />
          </div>
          <QuizNavigation
            canGoBack
            canGoNext={Boolean(selectedValue)}
            nextLabel={willEndAfterCurrent ? "Review Answers" : "Next"}
            onBack={handleBack}
            onNext={handleNext}
          />
        </>
      )}

      {session.status === "review" && (
        <section className="quiz-results-card premium-review-shell">
          <p className="quiz-flow-label">Review Answers</p>
          <h2>Before You Submit</h2>
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
            canGoNext
            nextLabel="Submit Quiz"
            onBack={handleBack}
            onNext={submitQuiz}
          />
        </section>
      )}

      {session.status === "complete" && session.result && (
        <section className="quiz-results-card premium-review-shell">
          <p className="quiz-flow-label">Quiz Complete</p>
          <h2>Nice work. Your personalized summary is ready.</h2>
          <p>You can view your results now and return to update answers anytime.</p>
          <div className="quiz-nav">
            <button className="secondary-btn" onClick={handleBack}>Back to Review</button>
            <button className="primary-btn" onClick={showResults}>View Results</button>
          </div>
        </section>
      )}

      {session.status === "results" && session.result && (
        <ResultsSummary
          result={session.result}
          onStartOver={startOver}
          onGoDashboard={() => navigate("/dashboard")}
          dashboardLabel={dashboardLabel}
        />
      )}
    </section>
  );
}

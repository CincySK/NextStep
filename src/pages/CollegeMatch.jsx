import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { loadQuizSession } from "../storage";
import { getEstimatedSteps } from "../quiz/quizEngine";
import { getResumeMeta, isResumableSession } from "../quiz/progressUtils";

const factors = [
  {
    title: "School size",
    text: "Find your fit between close-knit campuses and larger university ecosystems."
  },
  {
    title: "Campus vibe",
    text: "Balance social energy, community culture, and day-to-day student life."
  },
  {
    title: "Academic priorities",
    text: "Focus on affordability, mentorship, research, or career outcomes."
  },
  {
    title: "Support systems",
    text: "Compare advising, wellness, and first-year transition support."
  },
  {
    title: "Location preferences",
    text: "Choose environments where you can thrive academically and personally."
  }
];

export default function CollegeMatch() {
  const navigate = useNavigate();
  const savedSession = loadQuizSession("college");

  const canResume = useMemo(() => isResumableSession(savedSession), [savedSession]);
  const resumeMeta = useMemo(
    () => getResumeMeta(savedSession, getEstimatedSteps("college")),
    [savedSession]
  );

  return (
    <section className="section-card module-card">
      <div className="section-header">
        <div>
          <h2>College Match</h2>
          <p className="intro-copy">
            Start a guided quiz experience that adapts to your preferences and generates a personalized college-fit
            profile with next research steps.
          </p>
        </div>
      </div>

      <div className="look-grid">
        {factors.map((item) => (
          <article key={item.title} className="look-card">
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="cta-row">
        <button className="primary-btn" onClick={() => navigate("/college/quiz")}>
          Start College Match Quiz
        </button>
        {canResume && (
          <button className="secondary-btn" onClick={() => navigate("/college/quiz")}>
            Resume Quiz ({resumeMeta.currentStep}/{resumeMeta.totalSteps})
          </button>
        )}
      </div>
      {canResume && (
        <p className="quiz-meta">
          Progress saved at step {resumeMeta.currentStep} of {resumeMeta.totalSteps} ({resumeMeta.percent}% complete). Last updated {resumeMeta.updatedAtText}.
        </p>
      )}
    </section>
  );
}

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { loadQuizSession } from "../storage";
import { getEstimatedSteps } from "../quiz/quizEngine";
import { getResumeMeta, isResumableSession } from "../quiz/progressUtils";

const highlights = [
  {
    title: "Step 1: Understand your interests and values",
    text: "Start with an interest-survey style flow to identify what matters to you in work and lifestyle."
  },
  {
    title: "Step 2: Explore realistic career matches",
    text: "Get career matches grounded in your answers, with transparent fit explanations."
  },
  {
    title: "Step 3: Research and plan next moves",
    text: "Review work environment, salary notes, outlook, education path, and concrete next actions."
  }
];

export default function CareerPath() {
  const navigate = useNavigate();
  const savedSession = loadQuizSession("career");

  const canResume = useMemo(
    () => savedSession?.version === 2 && isResumableSession(savedSession),
    [savedSession]
  );
  const resumeMeta = useMemo(
    () => getResumeMeta(savedSession, savedSession?.questionOrder?.length ?? getEstimatedSteps("career")),
    [savedSession]
  );

  return (
    <section className="section-card module-card">
      <div className="section-header">
        <div>
          <h2>Career Path</h2>
          <p className="intro-copy">
            This guided career exploration process helps you identify fit, research options, and set practical next
            steps you can revisit as your goals evolve.
          </p>
        </div>
      </div>

      <div className="intro-grid">
        {highlights.map((item) => (
          <article key={item.title} className="mini-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="cta-row">
        <button className="primary-btn" onClick={() => navigate("/career/quiz")}>
          Take Quiz Now
        </button>
        {canResume && (
          <button className="secondary-btn" onClick={() => navigate("/career/quiz")}>
            Resume Quiz ({resumeMeta.currentStep}/{resumeMeta.totalSteps})
          </button>
        )}
        <button className="secondary-btn" onClick={() => navigate("/dashboard")}>
          Learn How It Works
        </button>
      </div>
      {canResume && (
        <p className="quiz-meta">
          Progress saved at step {resumeMeta.currentStep} of {resumeMeta.totalSteps} ({resumeMeta.percent}% complete). Last updated {resumeMeta.updatedAtText}.
        </p>
      )}
    </section>
  );
}

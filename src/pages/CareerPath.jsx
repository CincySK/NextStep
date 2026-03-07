import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { loadQuizSession } from "../storage";
import { getEstimatedSteps } from "../quiz/quizEngine";
import { getResumeMeta, isResumableSession } from "../quiz/progressUtils";

const highlights = [
  {
    title: "Match strengths to career paths",
    text: "Discover career areas aligned with how you think, solve problems, and collaborate."
  },
  {
    title: "Connect interests to majors",
    text: "See how your answers map to practical major options you can explore next."
  },
  {
    title: "Get a personalized roadmap",
    text: "Receive a narrative summary with concrete next steps for your next semester."
  }
];

export default function CareerPath() {
  const navigate = useNavigate();
  const savedSession = loadQuizSession("career");

  const canResume = useMemo(() => isResumableSession(savedSession), [savedSession]);
  const resumeMeta = useMemo(
    () => getResumeMeta(savedSession, getEstimatedSteps("career")),
    [savedSession]
  );

  return (
    <section className="section-card module-card">
      <div className="section-header">
        <div>
          <h2>Career Path</h2>
          <p className="intro-copy">
            Take a guided adaptive quiz that adjusts follow-up questions based on your answers and builds a clearer
            career direction.
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

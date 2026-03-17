import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { loadQuizSession } from "../storage";
import { getEstimatedSteps } from "../quiz/quizEngine";
import { getResumeMeta, isResumableSession } from "../quiz/progressUtils";

const factors = [
  {
    title: "School size",
    text: "Decide whether you thrive in close-knit communities or larger campus ecosystems."
  },
  {
    title: "Campus vibe",
    text: "Balance social atmosphere, environment, and the day-to-day feel of student life."
  },
  {
    title: "Academic priorities",
    text: "Focus on mentorship, outcomes, affordability, opportunity, or research depth."
  },
  {
    title: "Support systems",
    text: "Compare advising, wellness, and transition support that can shape your success."
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
    <section className="module-page-shell">
      <header className="module-hero module-hero-college">
        <div className="module-hero-copy">
          <p className="quest-kicker">College match</p>
          <h1>Find campus environments that actually fit you.</h1>
          <p className="quest-lead">
            Answer adaptive fit questions and generate a college profile that helps you shortlist schools with more clarity.
          </p>
          <div className="cta-row">
            <button className="primary-btn" onClick={() => navigate("/college/quiz")}>
              Start College Match Quiz
            </button>
            {canResume && (
              <button className="secondary-btn" onClick={() => navigate("/college/quiz")}>
                Resume ({resumeMeta.currentStep}/{resumeMeta.totalSteps})
              </button>
            )}
          </div>
          {canResume && (
            <p className="quiz-meta">
              Progress saved at step {resumeMeta.currentStep} of {resumeMeta.totalSteps} ({resumeMeta.percent}% complete). Last updated {resumeMeta.updatedAtText}.
            </p>
          )}
        </div>

        <aside className="module-side-card">
          <p className="quest-side-kicker">Fit signals</p>
          <div className="highlight-stack">
            {factors.map((item) => (
              <article key={item.title} className="highlight-card-dark">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </aside>
      </header>

      <section className="quest-panel">
        <div className="panel-head">
          <div>
            <p className="quest-kicker">How it works</p>
            <h2>From preferences to research list</h2>
          </div>
        </div>
        <div className="pathway-grid">
          <article className="pathway-node-card">
            <span className="pathway-node-order">01</span>
            <div className="pathway-node-copy">
              <h3>Answer adaptive questions</h3>
              <p>The quiz adjusts to what matters most to you instead of forcing one generic path.</p>
            </div>
          </article>
          <article className="pathway-node-card">
            <span className="pathway-node-order">02</span>
            <div className="pathway-node-copy">
              <h3>Build your fit profile</h3>
              <p>See the priorities shaping your ideal school environment and support needs.</p>
            </div>
          </article>
          <article className="pathway-node-card">
            <span className="pathway-node-order">03</span>
            <div className="pathway-node-copy">
              <h3>Turn results into action</h3>
              <p>Use your output to compare schools, shortlist options, and guide deeper research.</p>
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}

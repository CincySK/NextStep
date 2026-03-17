import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { loadQuizSession } from "../storage";
import { getEstimatedSteps } from "../quiz/quizEngine";
import { getResumeMeta, isResumableSession } from "../quiz/progressUtils";

const highlights = [
  {
    title: "Map your interests",
    text: "Start with a guided flow that translates interests, strengths, and priorities into real pathway signals."
  },
  {
    title: "Unlock role matches",
    text: "See plausible career directions with transparent reasoning instead of generic personality labels."
  },
  {
    title: "Build next steps",
    text: "Turn results into majors, research targets, and skill-building actions you can actually use."
  }
];

const questCards = [
  { title: "Interest signals", text: "Identify what energizes you across tasks, environments, and goals." },
  { title: "Lifestyle fit", text: "Balance work style, impact, flexibility, and growth when comparing roles." },
  { title: "Research missions", text: "Save roles worth researching and convert curiosity into a concrete plan." }
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
    <section className="module-page-shell">
      <header className="module-hero module-hero-career">
        <div className="module-hero-copy">
          <p className="quest-kicker">Career pathway</p>
          <h1>Discover work that fits how you think and grow.</h1>
          <p className="quest-lead">
            This guided career flow helps you understand your strengths, compare realistic roles, and leave with clear
            next actions instead of vague inspiration.
          </p>
          <div className="cta-row">
            <button className="primary-btn" onClick={() => navigate("/career/quiz")}>
              Take Career Quiz
            </button>
            {canResume && (
              <button className="secondary-btn" onClick={() => navigate("/career/quiz")}>
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
          <p className="quest-side-kicker">Mission structure</p>
          <div className="highlight-stack">
            {highlights.map((item, index) => (
              <article key={item.title} className="highlight-card-dark">
                <span className="pathway-node-order">0{index + 1}</span>
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
            <p className="quest-kicker">Quest board</p>
            <h2>What this module helps you do</h2>
          </div>
        </div>
        <div className="task-card-grid">
          {questCards.map((item) => (
            <article key={item.title} className="task-card">
              <span className="task-chip">Career</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

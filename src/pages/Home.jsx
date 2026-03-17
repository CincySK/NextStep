import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import ProgressBadge from "../components/ProgressBadge";
import { loadPersonalizationProfile } from "../personalization/personalizationStorage";
import { loadAppData } from "../storage";

export default function Home() {
  const navigate = useNavigate();
  const { isGuestMode, isAuthenticated, userRole } = useAuth();
  const [snapshot] = useState(loadAppData());
  const profile = loadPersonalizationProfile();

  const completedCount = useMemo(
    () => Object.values(snapshot.progress).filter(Boolean).length,
    [snapshot.progress]
  );

  if (isAuthenticated && userRole === "teacher") {
    return <Navigate to="/dashboard" replace />;
  }

  const heroTitle = profile?.hero?.title ?? "Your future path starts here.";
  const heroBody = profile?.hero?.body ?? "Build momentum with guided career exploration, college-fit planning, money confidence, and tutoring support that all stay in sync.";
  const heroKicker = profile?.primaryPath ? `Focus path: ${profile.primaryPath}` : "NextStep mission control";
  const nextAction = profile?.suggestedNextActions?.[0] ?? "Complete one module, save one insight, and keep your momentum moving.";
  const modeLabel = profile?.modeLabel ?? "Your dashboard adapts as you explore.";
  const reasonWhy = profile?.reasonWhy ?? "Every module you finish unlocks stronger recommendations and a clearer plan.";
  const highlights = profile?.homeHighlights ?? [
    { title: "Career planning", body: "Turn interests into realistic pathways and save careers worth researching." },
    { title: "College fit", body: "Match your priorities to school environments and build a shortlist." },
    { title: "Money confidence", body: "Practice budget, savings, and credit decisions with feedback." }
  ];

  const featureCards = [
    {
      title: "Career Path",
      description: "Adaptive quiz, pathway research, and practical next steps.",
      meta: snapshot.progress.careerComplete ? "Completed" : "Ready to start",
      statusClass: snapshot.progress.careerComplete ? "status-complete" : "status-active",
      to: "/career"
    },
    {
      title: "College Match",
      description: "Compare campus fit, support systems, and academic priorities.",
      meta: snapshot.progress.collegeComplete ? "Completed" : "In progress",
      statusClass: snapshot.progress.collegeComplete ? "status-complete" : "status-recommended",
      to: "/college"
    },
    {
      title: "Money Skills",
      description: "Short, gamified exercises for budgeting, saving, and credit basics.",
      meta: snapshot.progress.moneyComplete ? "Completed" : "Challenge available",
      statusClass: snapshot.progress.moneyComplete ? "status-complete" : "status-locked",
      to: "/money"
    },
    {
      title: "Study Assistant",
      description: "Use AI help for assignments, screenshots, writing, and concept review.",
      meta: "Always available",
      statusClass: "status-active",
      to: "/study-assistant"
    }
  ];

  const taskCards = [
    { title: "Complete one module", body: "Finish one guided module to grow your personalized plan.", to: "/dashboard" },
    { title: "Save one idea", body: `You have ${snapshot.favorites.length} saved items. Add one more from a quiz result.`, to: "/career" },
    { title: "Open class support", body: "Join a class or open coursework with AI context.", to: "/classes" }
  ];

  return (
    <section className="quest-dashboard-shell">
      {!isAuthenticated && isGuestMode && (
        <section className="guest-reminder guest-reminder-dark">
          <p>You&apos;re exploring in guest mode. Create an account to save progress permanently.</p>
          <button className="primary-btn" onClick={() => navigate("/signup")}>Create Account</button>
        </section>
      )}

      <header className="quest-hero">
        <div className="quest-hero-copy">
          <p className="quest-kicker">{heroKicker}</p>
          <h1>{heroTitle}</h1>
          <p className="quest-lead">{heroBody}</p>
          <p className="quest-subtle">{modeLabel}</p>
          <div className="badge-row">
            <ProgressBadge label="Completed Modules" value={`${completedCount}/3`} />
            <ProgressBadge label="Saved Favorites" value={snapshot.favorites.length} />
          </div>
          <div className="cta-row">
            <button className="primary-btn" onClick={() => navigate("/dashboard")}>Open Dashboard</button>
            <button className="secondary-btn" onClick={() => navigate("/career")}>Start Exploring</button>
          </div>
        </div>
        <aside className="quest-side-panel">
          <p className="quest-side-kicker">Recommended next action</p>
          <h3>Stay in motion</h3>
          <p>{nextAction}</p>
          <div className="quest-side-stack">
            <div className="quest-mini-stat">
              <strong>{completedCount}</strong>
              <span>Modules cleared</span>
            </div>
            <div className="quest-mini-stat">
              <strong>{snapshot.favorites.length}</strong>
              <span>Saved ideas</span>
            </div>
          </div>
          <p className="quest-side-reason">{reasonWhy}</p>
        </aside>
      </header>

      <section className="pathway-panel">
        <div className="panel-head">
          <div>
            <p className="quest-kicker">Pathways</p>
            <h2>Choose your next track</h2>
          </div>
        </div>
        <div className="pathway-grid">
          {featureCards.map((card, index) => (
            <button key={card.title} className="pathway-node-card" onClick={() => navigate(card.to)}>
              <span className="pathway-node-order">0{index + 1}</span>
              <div className="pathway-node-copy">
                <div className="pathway-node-top">
                  <h3>{card.title}</h3>
                  <span className={`status-chip ${card.statusClass}`}>{card.meta}</span>
                </div>
                <p>{card.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="quest-grid-two">
        <section className="quest-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Daily goals</p>
              <h2>Small wins that build momentum</h2>
            </div>
          </div>
          <div className="task-card-grid">
            {taskCards.map((task) => (
              <button key={task.title} className="task-card" onClick={() => navigate(task.to)}>
                <span className="task-chip">Quest</span>
                <h3>{task.title}</h3>
                <p>{task.body}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="quest-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Why NextStep</p>
              <h2>Modules working together</h2>
            </div>
          </div>
          <div className="highlight-stack">
            {highlights.map((item) => (
              <article key={item.title} className="highlight-card-dark">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

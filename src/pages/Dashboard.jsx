import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import ProgressBadge from "../components/ProgressBadge";
import {
  clearPersonalizationFlash,
  loadPersonalizationFlash,
  loadPersonalizationProfile
} from "../personalization/personalizationStorage";
import { loadAppData, updateAppData } from "../storage";
import { loadOnboardingData } from "../onboarding/onboardingStorage";

function getOnboardingSuggestions(profile) {
  if (!profile) return [];
  if (profile.primaryPath && (!profile.helpAreas || profile.helpAreas.length === 0)) {
    if (profile.primaryPath === "career") return ["Continue with career matches, major exploration, and related college research."];
    if (profile.primaryPath === "college") return ["Keep refining your college fit profile and shortlist schools to research."];
    return ["Build money confidence through short practical exercises and weekly goals."];
  }
  const suggestions = [];
  const helpSet = new Set(profile.helpAreas ?? []);

  if (helpSet.has("all") || helpSet.has("careers")) suggestions.push("Try the Career Path quiz and save two roles to compare.");
  if (helpSet.has("all") || helpSet.has("colleges")) suggestions.push("Complete College Match and shortlist 3 schools to research.");
  if (helpSet.has("all") || helpSet.has("money")) suggestions.push("Finish one Money Skills activity and track your progress.");
  if (profile.learningGoals === "majors") suggestions.push("Use your career results to compare majors tied to top matches.");
  if ((profile.interests ?? []).length > 0) {
    suggestions.push(`Explore career paths connected to: ${(profile.interests ?? []).slice(0, 3).join(", ")}.`);
  }

  return suggestions.slice(0, 4);
}

export default function Dashboard({ onRestartOnboarding }) {
  const navigate = useNavigate();
  const { user, isGuestMode, isAuthenticated, userRole } = useAuth();
  const [data, setData] = useState(loadAppData());
  const profile = loadPersonalizationProfile();
  const [flash, setFlash] = useState(() => loadPersonalizationFlash());
  const onboardingProfile = loadOnboardingData();
  const suggestions = useMemo(() => getOnboardingSuggestions(onboardingProfile), [onboardingProfile]);

  const completedCount = useMemo(
    () => Object.values(data.progress).filter(Boolean).length,
    [data.progress]
  );

  function removeFavorite(item) {
    const next = updateAppData((current) => ({
      ...current,
      favorites: current.favorites.filter((f) => !(f.type === item.type && f.name === item.name))
    }));
    setData(next);
  }

  function formatTimestamp(value) {
    if (!value) return "Not available";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "Not available" : parsed.toLocaleString();
  }

  const displayName = user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Alex";
  const firstName = String(displayName).split(" ")[0] || "Alex";

  const featureCards = [
    {
      id: "career",
      title: "Career Path Quiz",
      description: "Discover careers that match your interests and skills.",
      meta: data.progress.careerComplete ? "Completed" : "Recommended next",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=1200&q=80",
      to: "/career",
      statusClass: data.progress.careerComplete ? "status-complete" : "status-recommended"
    },
    {
      id: "college",
      title: "College Match Quiz",
      description: "Find colleges aligned with your goals, support needs, and environment fit.",
      meta: data.progress.collegeComplete ? "Completed" : "In progress",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
      to: "/college",
      statusClass: data.progress.collegeComplete ? "status-complete" : "status-active"
    },
    {
      id: "money",
      title: "Money Skills",
      description: "Practice savings, spending, and credit basics through short lessons.",
      meta: data.progress.moneyComplete ? "Completed" : "Challenge ready",
      image: "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?auto=format&fit=crop&w=1200&q=80",
      to: "/money",
      statusClass: data.progress.moneyComplete ? "status-complete" : "status-locked"
    }
  ];

  const modulePath = [
    { label: "Career", complete: data.progress.careerComplete, to: "/career" },
    { label: "College", complete: data.progress.collegeComplete, to: "/college" },
    { label: "Money", complete: data.progress.moneyComplete, to: "/money" },
    { label: "Assistant", complete: false, to: "/study-assistant" }
  ];

  const questCards = [
    { title: "Open Study Assistant", body: "Get contextual help with writing, math, concepts, and assignments.", to: "/study-assistant" },
    { title: "Review My Classes", body: "Check assignments, class context, and upcoming coursework.", to: "/classes" },
    { title: "Restart onboarding", body: "Refresh your personalization signals and pathway priorities.", onClick: onRestartOnboarding }
  ];

  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(() => {
      clearPersonalizationFlash();
      setFlash(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [flash]);

  return (
    <section className="quest-dashboard-shell">
      {isGuestMode && (
        <section className="guest-reminder guest-reminder-dark">
          <p>You&apos;re using guest mode. Create an account to permanently save progress.</p>
          <button className="primary-btn" onClick={() => navigate("/signup")}>Create Account</button>
        </section>
      )}

      {flash && (
        <section className="flash-banner flash-banner-dark">
          <p className="quiz-flow-label">Personalization ready</p>
          <h3>{flash.title ?? "Your dashboard just leveled up."}</h3>
          <p>NextStep reshaped your learning hub around your selected pathway and recent results.</p>
        </section>
      )}

      <header className="quest-hero dashboard-hero">
        <div className="quest-hero-copy">
          <p className="quest-kicker">Student command center</p>
          <h1>Welcome back, {firstName}.</h1>
          <p className="quest-lead">You&apos;re building a sharper plan across careers, colleges, money, and coursework support.</p>
          <div className="badge-row">
            <ProgressBadge label="Completed Modules" value={`${completedCount}/3`} />
            <ProgressBadge label="Saved Favorites" value={data.favorites.length} />
            <ProgressBadge label="Career History" value={data.quizResults?.careerHistory?.length ?? 0} />
          </div>
          <div className="cta-row">
            <button className="primary-btn" onClick={() => navigate("/career")}>Continue journey</button>
            <button className="secondary-btn" onClick={() => navigate("/study-assistant")}>Ask the AI tutor</button>
          </div>
        </div>
        <aside className="quest-side-panel">
          <p className="quest-side-kicker">Current focus</p>
          <h3>{profile?.primaryPath ? `${profile.primaryPath} pathway active` : "Pick your next move"}</h3>
          <p>{profile?.reasonWhy ?? "Your actions here tune the platform toward what matters most to you."}</p>
          <div className="path-progress-mini">
            {modulePath.map((step, index) => (
              <button key={step.label} className={`path-progress-dot ${step.complete ? "path-progress-dot-complete" : ""}`} onClick={() => navigate(step.to)}>
                <span>{index + 1}</span>
                <strong>{step.label}</strong>
              </button>
            ))}
          </div>
        </aside>
      </header>

      <section className="pathway-panel">
        <div className="panel-head">
          <div>
            <p className="quest-kicker">Learning path</p>
            <h2>Progressive modules</h2>
          </div>
        </div>
        <div className="feature-module-grid">
          {featureCards.map((card) => (
            <article key={card.id} className="feature-module-card" onClick={() => navigate(card.to)} role="button" tabIndex={0} onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") navigate(card.to);
            }}>
              <img src={card.image} alt={card.title} className="feature-module-image" />
              <div className="feature-module-body">
                <div className="feature-module-top">
                  <h3>{card.title}</h3>
                  <span className={`status-chip ${card.statusClass}`}>{card.meta}</span>
                </div>
                <p>{card.description}</p>
                <span className="feature-module-link">Open module</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="quest-grid-two">
        <section className="quest-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Quests</p>
              <h2>Daily momentum tasks</h2>
            </div>
          </div>
          <div className="task-card-grid">
            {questCards.map((task) => (
              <button key={task.title} className="task-card" onClick={task.onClick ?? (() => navigate(task.to))}>
                <span className="task-chip">Active</span>
                <h3>{task.title}</h3>
                <p>{task.body}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="quest-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Live data</p>
              <h2>Progress overview</h2>
            </div>
          </div>
          <div className="rail-stat-grid dashboard-stat-grid">
            <div className="rail-stat">
              <strong>{data.scores.career ?? "-"}</strong>
              <span>Career score</span>
            </div>
            <div className="rail-stat">
              <strong>{data.scores.college ?? "-"}</strong>
              <span>College score</span>
            </div>
            <div className="rail-stat">
              <strong>{data.scores.money ?? "-"}</strong>
              <span>Money score</span>
            </div>
            <div className="rail-stat">
              <strong>{isAuthenticated && userRole === "teacher" ? "Teacher" : "Student"}</strong>
              <span>Current role</span>
            </div>
          </div>
        </section>
      </div>

      {suggestions.length > 0 && (
        <section className="quest-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Recommendations</p>
              <h2>Personalized suggestions</h2>
            </div>
          </div>
          <div className="highlight-stack">
            {suggestions.map((item) => (
              <article key={item} className="highlight-card-dark">
                <h3>Suggested next step</h3>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {data.favorites.length > 0 && (
        <section className="quest-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Saved</p>
              <h2>Bookmarks and ideas</h2>
            </div>
          </div>
          <ul className="list-clean list-clean-dark">
            {data.favorites.map((fav) => (
              <li key={`${fav.type}-${fav.name}`} className="favorite-item favorite-item-dark">
                <span>{fav.name} <small>({fav.type})</small></span>
                <button className="mini-action" onClick={() => removeFavorite(fav)}>Remove</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.quizResults?.careerHistory?.length > 0 && (
        <section className="quest-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">History</p>
              <h2>Career exploration log</h2>
            </div>
          </div>
          <ul className="list-clean list-clean-dark">
            {data.quizResults.careerHistory.map((item) => (
              <li key={item.createdAt}>
                {formatTimestamp(item.createdAt)}: Top themes around <strong>{item.topDomain}</strong> with paths like {item.topCareerTitles.slice(0, 2).join(", ")}.
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}

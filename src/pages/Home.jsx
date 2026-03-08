import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import FeatureCard from "../components/FeatureCard";
import ProgressBadge from "../components/ProgressBadge";
import { loadPersonalizationProfile } from "../personalization/personalizationStorage";
import { loadAppData } from "../storage";

export default function Home() {
  const navigate = useNavigate();
  const { isGuestMode, isAuthenticated, userRole } = useAuth();
  const [snapshot] = useState(loadAppData());
  const profile = loadPersonalizationProfile();

  const completedCount = useMemo(
    () =>
      Object.values(snapshot.progress).filter(Boolean).length,
    [snapshot.progress]
  );

  const heroTitle = profile?.hero?.title ?? "Welcome to NextStep";
  const heroBody = profile?.hero?.body ?? "Build clarity one lesson at a time. NextStep helps you explore careers, compare college environments, and practice real-world money decisions with guided feedback.";
  const heroKicker = profile?.primaryPath
    ? `Personalized for your ${profile.primaryPath} path`
    : "Student Planning Platform";
  const nextAction = profile?.suggestedNextActions?.[0] ?? "Finish one learning module and save one insight to your dashboard learning hub.";
  const modeLabel = profile?.modeLabel ?? "Start your first pathway to unlock a personalized plan.";
  const reasonWhy = profile?.reasonWhy ?? "";
  const highlights = profile?.homeHighlights ?? [];

  const featureOrder = profile?.primaryPath === "career"
    ? ["career", "college", "money"]
    : profile?.primaryPath === "college"
      ? ["college", "career", "money"]
      : profile?.primaryPath === "money"
        ? ["money", "career", "college"]
        : ["career", "college", "money"];

  const featureConfig = {
    career: {
      title: "Career Path",
      description: "Take a short strengths quiz and identify career clusters that match your interests.",
      supportText: "Get role ideas, then save careers you want to research next.",
      to: "/career"
    },
    college: {
      title: "College Match",
      description: "Answer campus and learning-style questions to discover sample college fits.",
      supportText: "Use your results to build a focused college research list.",
      to: "/college"
    },
    money: {
      title: "Money Skills",
      description: "Practice core financial literacy with short interactive exercises and feedback.",
      supportText: "Learn budgeting, savings, and credit basics in student-friendly lessons.",
      to: "/money"
    }
  };

  const quickActionMap = {
    "/career": { label: "Open Career Path", to: "/career" },
    "/career/quiz": { label: "Take Career Quiz", to: "/career/quiz" },
    "/college": { label: "Open College Match", to: "/college" },
    "/college/quiz": { label: "Take College Quiz", to: "/college/quiz" },
    "/money": { label: "Open Money Skills", to: "/money" },
    "/dashboard": { label: "Go to Dashboard", to: "/dashboard" },
    "/study-assistant": { label: "Open Study Assistant", to: "/study-assistant" },
    "/classes": { label: "Open My Classes", to: "/classes" }
  };

  const quickActions = (profile?.quickLinks ?? ["/career", "/college", "/money"])
    .map((path) => quickActionMap[path])
    .filter(Boolean)
    .slice(0, 3);

  if (isAuthenticated && userRole === "teacher") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      {!isAuthenticated && isGuestMode && (
        <section className="guest-reminder">
          <p>You&apos;re exploring in guest mode. Create an account to save progress permanently.</p>
          <button className="primary-btn" onClick={() => navigate("/signup")}>Create Account</button>
        </section>
      )}

      <section className={`hero card hero-accent-${profile?.accentMode ?? "default"}`}>
        <div>
          <p className="hero-kicker">{heroKicker}</p>
          <h1>{heroTitle}</h1>
          <p>{heroBody}</p>
          <p className="hero-mode-label">{modeLabel}</p>
          {reasonWhy && <p className="hero-why">{reasonWhy}</p>}
          <div className="badge-row">
            <ProgressBadge label="Completed Modules" value={`${completedCount}/3`} tone="default" />
            <ProgressBadge label="Saved Favorites" value={snapshot.favorites.length} tone="default" />
          </div>
        </div>
        <div className="hero-panel">
          <h3>Your Recommended Next Action</h3>
          <p>{nextAction}</p>
          <div className="cta-row quick-links-row">
            {quickActions.map((action) => (
              <button key={action.to} className="secondary-btn" onClick={() => navigate(action.to)}>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="dashboard-grid home-highlight-grid">
          {highlights.map((item) => (
            <article key={item.title} className="mini-card home-highlight-card">
              <p className="context-label">Why this is featured</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </section>
      )}

      <section className="feature-grid">
        {featureOrder.map((key) => (
          <FeatureCard
            key={key}
            title={featureConfig[key].title}
            description={featureConfig[key].description}
            supportText={featureConfig[key].supportText}
            to={featureConfig[key].to}
            onNavigate={navigate}
          />
        ))}
      </section>
    </>
  );
}

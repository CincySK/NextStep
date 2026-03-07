import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import ProgressBadge from "../components/ProgressBadge";
import { loadPersonalizationProfile } from "../personalization/personalizationStorage";
import { loadAppData } from "../storage";

export default function Home() {
  const navigate = useNavigate();
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

  return (
    <>
      <section className={`hero card hero-accent-${profile?.accentMode ?? "default"}`}>
        <div>
          <p className="hero-kicker">{heroKicker}</p>
          <h1>{heroTitle}</h1>
          <p>{heroBody}</p>
          <div className="badge-row">
            <ProgressBadge label="Completed Modules" value={`${completedCount}/3`} tone="default" />
            <ProgressBadge label="Saved Favorites" value={snapshot.favorites.length} tone="default" />
          </div>
        </div>
        <div className="hero-panel">
          <h3>Your Recommended Next Action</h3>
          <p>{nextAction}</p>
        </div>
      </section>

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

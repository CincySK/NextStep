import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import ProgressBadge from "../components/ProgressBadge";
import { loadAppData } from "../storage";

export default function Home() {
  const navigate = useNavigate();
  const [snapshot] = useState(loadAppData());

  const completedCount = useMemo(
    () =>
      Object.values(snapshot.progress).filter(Boolean).length,
    [snapshot.progress]
  );

  return (
    <>
      <section className="hero">
        <div>
          <p className="hero-kicker">Future Planning Toolkit</p>
          <h1>Find Your Future</h1>
          <p>
            Explore career directions, discover matching colleges, and build money confidence through guided activities.
          </p>
          <div className="badge-row">
            <ProgressBadge label="Completed Modules" value={`${completedCount}/3`} tone="default" />
            <ProgressBadge label="Saved Favorites" value={snapshot.favorites.length} tone="default" />
          </div>
        </div>
        <div className="hero-panel">
          <h3>Today&apos;s Goal</h3>
          <p>Complete one quiz and save at least one favorite result to your dashboard.</p>
        </div>
      </section>

      <section className="feature-grid">
        <FeatureCard
          title="Career Path"
          description="Take a short quiz and match with realistic career clusters."
          to="/career"
          tone="career"
          onNavigate={navigate}
        />
        <FeatureCard
          title="College Match"
          description="Answer preference questions and review sample college fits."
          to="/college"
          tone="college"
          onNavigate={navigate}
        />
        <FeatureCard
          title="Money Skills"
          description="Play with your monthly budget and track your remaining balance live."
          to="/money"
          tone="money"
          onNavigate={navigate}
        />
      </section>
    </>
  );
}
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
      <section className="hero card">
        <div>
          <p className="hero-kicker">Student Planning Platform</p>
          <h1>Welcome to NextStep</h1>
          <p>
            Build clarity one lesson at a time. NextStep helps you explore careers, compare college environments, and
            practice real-world money decisions with guided feedback.
          </p>
          <div className="badge-row">
            <ProgressBadge label="Completed Modules" value={`${completedCount}/3`} tone="default" />
            <ProgressBadge label="Saved Favorites" value={snapshot.favorites.length} tone="default" />
          </div>
        </div>
        <div className="hero-panel">
          <h3>Today&apos;s Next Step</h3>
          <p>Finish one learning module and save one insight to your dashboard learning hub.</p>
        </div>
      </section>

      <section className="feature-grid">
        <FeatureCard
          title="Career Path"
          description="Take a short strengths quiz and identify career clusters that match your interests."
          supportText="Get role ideas, then save careers you want to research next."
          to="/career"
          onNavigate={navigate}
        />
        <FeatureCard
          title="College Match"
          description="Answer campus and learning-style questions to discover sample college fits."
          supportText="Use your results to build a focused college research list."
          to="/college"
          onNavigate={navigate}
        />
        <FeatureCard
          title="Money Skills"
          description="Practice core financial literacy with short interactive exercises and feedback."
          supportText="Learn budgeting, savings, and credit basics in student-friendly lessons."
          to="/money"
          onNavigate={navigate}
        />
      </section>
    </>
  );
}

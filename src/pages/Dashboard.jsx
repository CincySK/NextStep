import { useMemo, useState } from "react";
import ProgressBadge from "../components/ProgressBadge";
import { loadAppData, updateAppData } from "../storage";
import { loadOnboardingData } from "../onboarding/onboardingStorage";

function getOnboardingSuggestions(profile) {
  if (!profile) return [];
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
  const [data, setData] = useState(loadAppData());
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

  return (
    <section className="section-card module-card">
      <div className="section-header">
        <div>
          <h2>Learning Hub</h2>
          <p className="intro-copy">Track your module progress and keep the options you want to revisit.</p>
        </div>
        <div className="badge-row">
          <ProgressBadge label="Completed" value={`${completedCount}/3`} />
          <ProgressBadge label="Favorites" value={data.favorites.length} />
        </div>
      </div>

      <div className="cta-row">
        <button className="secondary-btn" onClick={onRestartOnboarding}>
          Restart Onboarding
        </button>
      </div>

      {suggestions.length > 0 && (
        <section className="result-card">
          <h3>Personalized Suggestions</h3>
          <ul className="list-clean">
            {suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="dashboard-grid">
        <article className="mini-card">
          <h3>Module Progress</h3>
          <ul className="list-clean">
            <li>Career Path: {data.progress.careerComplete ? "Done" : "Pending"}</li>
            <li>College Match: {data.progress.collegeComplete ? "Done" : "Pending"}</li>
            <li>Money Skills: {data.progress.moneyComplete ? "Done" : "Pending"}</li>
          </ul>
        </article>

        <article className="mini-card">
          <h3>Latest Outcomes</h3>
          <ul className="list-clean">
            <li>Career: {data.scores.career ?? "-"}</li>
            <li>College: {data.scores.college ?? "-"}</li>
            <li>Money: {data.scores.money ?? "-"}</li>
          </ul>
        </article>

        <article className="mini-card">
          <h3>Saved Ideas</h3>
          {data.favorites.length === 0 ? (
            <p>No saved items yet. Add careers or colleges from your module results.</p>
          ) : (
            <ul className="list-clean">
              {data.favorites.map((fav) => (
                <li key={`${fav.type}-${fav.name}`} className="favorite-item">
                  <span>{fav.name} <small>({fav.type})</small></span>
                  <button className="mini-action" onClick={() => removeFavorite(fav)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      {(data.quizResults?.career || data.quizResults?.college) && (
        <div className="dashboard-grid">
          {data.quizResults?.career && (
            <article className="mini-card">
              <h3>Career Quiz Snapshot</h3>
              <p>{data.quizResults.career.narrative ?? data.quizResults.career.whyItFits}</p>
              <p className="mini-label">Updated: {formatTimestamp(data.quizResults.career.completedAt)}</p>
            </article>
          )}
          {data.quizResults?.college && (
            <article className="mini-card">
              <h3>College Quiz Snapshot</h3>
              <p>{data.quizResults.college.whyItFits}</p>
              <p className="mini-label">Updated: {formatTimestamp(data.quizResults.college.completedAt)}</p>
            </article>
          )}
        </div>
      )}

      {data.quizResults?.careerHistory?.length > 0 && (
        <section className="result-card">
          <h3>Career Exploration History</h3>
          <ul className="list-clean">
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

import { useMemo, useState } from "react";
import ProgressBadge from "../components/ProgressBadge";
import { loadAppData, updateAppData } from "../storage";

export default function Dashboard() {
  const [data, setData] = useState(loadAppData());

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
              <p>{data.quizResults.career.whyItFits}</p>
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
    </section>
  );
}

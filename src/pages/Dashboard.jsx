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

  return (
    <section className="section-card">
      <div className="section-header">
        <h2>Dashboard</h2>
        <div className="badge-row">
          <ProgressBadge label="Completed" value={`${completedCount}/3`} />
          <ProgressBadge label="Favorites" value={data.favorites.length} />
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="mini-card">
          <h3>Progress</h3>
          <ul className="list-clean">
            <li>Career Path: {data.progress.careerComplete ? "Done" : "Pending"}</li>
            <li>College Match: {data.progress.collegeComplete ? "Done" : "Pending"}</li>
            <li>Money Skills: {data.progress.moneyComplete ? "Done" : "Pending"}</li>
          </ul>
        </article>

        <article className="mini-card">
          <h3>Latest Results</h3>
          <ul className="list-clean">
            <li>Career: {data.scores.career ?? "-"}</li>
            <li>College: {data.scores.college ?? "-"}</li>
            <li>Money: {data.scores.money ?? "-"}</li>
          </ul>
        </article>

        <article className="mini-card">
          <h3>Saved Favorites</h3>
          {data.favorites.length === 0 ? (
            <p>No favorites yet. Save one from Career Path or College Match.</p>
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
    </section>
  );
}
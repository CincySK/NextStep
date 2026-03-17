import { Link } from "react-router-dom";
import JoinClass from "./JoinClass";

export default function ClassDashboard({
  userId,
  enrolledClasses,
  teachingClasses,
  onRefresh
}) {
  return (
    <section className="module-page-shell">
      <header className="module-hero module-hero-classes">
        <div className="module-hero-copy">
          <p className="quest-kicker">Classes hub</p>
          <h1>Keep assignments, class context, and tutoring in one place.</h1>
          <p className="quest-lead">
            Join classes, review posted work, and launch the Study Assistant with the right assignment context when you need help.
          </p>
        </div>
        <aside className="module-side-card">
          <p className="quest-side-kicker">Snapshot</p>
          <div className="rail-stat-grid">
            <div className="rail-stat">
              <strong>{enrolledClasses.length}</strong>
              <span>Classes joined</span>
            </div>
            <div className="rail-stat">
              <strong>{teachingClasses.length}</strong>
              <span>Classes taught</span>
            </div>
          </div>
        </aside>
      </header>

      <div className="quest-grid-two">
        <JoinClass userId={userId} onJoined={onRefresh} />

        <section className="quest-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Enrolled</p>
              <h2>Your active classes</h2>
            </div>
          </div>
          {enrolledClasses.length === 0 ? (
            <p>No classes joined yet.</p>
          ) : (
            <ul className="list-clean list-clean-dark">
              {enrolledClasses.map((item) => (
                <li key={item.classId}>
                  <Link className="user-link" to={`/classes/${item.classId}`}>
                    {item.className}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="quest-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Teaching</p>
              <h2>Classes you lead</h2>
            </div>
          </div>
          {teachingClasses.length === 0 ? (
            <p>You are not teaching any classes yet.</p>
          ) : (
            <ul className="list-clean list-clean-dark">
              {teachingClasses.map((item) => (
                <li key={item.classId}>
                  <Link className="user-link" to={`/classes/${item.classId}`}>
                    {item.className}
                  </Link>
                  <p className="mini-label">Join Code: <strong>{item.classCode}</strong></p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}

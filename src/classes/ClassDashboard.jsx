import { Link } from "react-router-dom";
import JoinClass from "./JoinClass";

export default function ClassDashboard({
  userId,
  enrolledClasses,
  teachingClasses,
  onRefresh
}) {
  return (
    <section className="section-card module-card">
      <div className="section-header">
        <div>
          <h2>My Classes</h2>
          <p className="intro-copy">
            Join classes, review assignments, and open Study Assistant with assignment context.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <JoinClass userId={userId} onJoined={onRefresh} />

        <article className="mini-card">
          <h3>Enrolled Classes</h3>
          {enrolledClasses.length === 0 ? (
            <p>No classes joined yet.</p>
          ) : (
            <ul className="list-clean">
              {enrolledClasses.map((item) => (
                <li key={item.classId}>
                  <Link className="user-link" to={`/classes/${item.classId}`}>
                    {item.className}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="mini-card">
          <h3>Classes You Teach</h3>
          {teachingClasses.length === 0 ? (
            <p>You are not teaching any classes yet.</p>
          ) : (
            <ul className="list-clean">
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
        </article>
      </div>
    </section>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createClass } from "../classes/schoolService";
import { loadSchoolData } from "../classes/sharedSchoolStore";
import AssignmentUploader from "./AssignmentUploader";
import StudentManager from "./StudentManager";

export default function TeacherDashboard({ teacherId }) {
  const [school, setSchool] = useState(() => loadSchoolData());
  const [form, setForm] = useState({
    className: "",
    subject: "",
    description: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const myClasses = useMemo(
    () =>
      (school.teacherClasses?.[teacherId] ?? [])
        .map((id) => school.classes?.[id])
        .filter(Boolean),
    [school, teacherId]
  );

  function refreshSchool() {
    setSchool(loadSchoolData());
  }

  function handleCreateClass(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const created = createClass({
        teacherId,
        className: form.className,
        subject: form.subject,
        description: form.description
      });
      setSchool(created.school);
      setForm({ className: "", subject: "", description: "" });
      const newClass = created.school.classes?.[created.classId];
      setMessage(`Class created. Share join code ${newClass?.classCode ?? ""} with students.`);
    } catch (err) {
      setError(err.message ?? "Could not create class.");
    }
  }

  return (
    <section className="module-page-shell">
      <header className="module-hero module-hero-teacher">
        <div className="module-hero-copy">
          <p className="quest-kicker">Teacher workspace</p>
          <h1>Run classes, assignments, and tutoring context from one control room.</h1>
          <p className="quest-lead">
            Create classes, upload materials, and connect coursework to the NextStep Study Assistant so students get more relevant support.
          </p>
        </div>
        <aside className="module-side-card">
          <p className="quest-side-kicker">Overview</p>
          <div className="rail-stat-grid">
            <div className="rail-stat">
              <strong>{myClasses.length}</strong>
              <span>Classes</span>
            </div>
            <div className="rail-stat">
              <strong>{myClasses.reduce((sum, item) => sum + (item.assignmentIds?.length ?? 0), 0)}</strong>
              <span>Assignments</span>
            </div>
          </div>
        </aside>
      </header>

      <div className="quest-grid-two">
        <section className="quest-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Create</p>
              <h2>Launch a new class</h2>
            </div>
          </div>
          <form className="auth-form" onSubmit={handleCreateClass}>
            <label className="field">
              Class name
              <input
                value={form.className}
                onChange={(event) => setForm((prev) => ({ ...prev, className: event.target.value }))}
                placeholder="Algebra II"
              />
            </label>
            <label className="field">
              Subject
              <input
                value={form.subject}
                onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                placeholder="Mathematics"
              />
            </label>
            <label className="field">
              Description
              <textarea
                className="chat-input"
                rows={3}
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Class purpose and expectations."
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            {message && <p className="feedback">{message}</p>}
            <button className="primary-btn" type="submit">Create Class</button>
          </form>
        </section>

        <section className="quest-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Manage</p>
              <h2>My classes</h2>
            </div>
          </div>
          {myClasses.length === 0 ? (
            <p>No classes yet.</p>
          ) : (
            <ul className="list-clean list-clean-dark">
              {myClasses.map((item) => (
                <li key={item.classId}>
                  <Link className="user-link" to={`/classes/${item.classId}`}>{item.className}</Link>
                  <p className="mini-label">Join code: <strong>{item.classCode}</strong></p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="quest-grid-two">
        <AssignmentUploader teacherId={teacherId} classes={myClasses} onSaved={refreshSchool} />
        <StudentManager classList={myClasses} />
      </div>
    </section>
  );
}

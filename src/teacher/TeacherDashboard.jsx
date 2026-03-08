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
    <section className="section-card module-card">
      <div className="section-header">
        <div>
          <h2>Teacher Dashboard</h2>
          <p className="intro-copy">
            Create classes, upload assignments, and connect coursework to NextStep Study Assistant context.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="mini-card">
          <h3>Create Class</h3>
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
        </article>

        <article className="mini-card">
          <h3>My Classes</h3>
          {myClasses.length === 0 ? (
            <p>No classes yet.</p>
          ) : (
            <ul className="list-clean">
              {myClasses.map((item) => (
                <li key={item.classId}>
                  <Link className="user-link" to={`/classes/${item.classId}`}>{item.className}</Link>
                  <p className="mini-label">Join code: <strong>{item.classCode}</strong></p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      <div className="dashboard-grid">
        <AssignmentUploader teacherId={teacherId} classes={myClasses} onSaved={refreshSchool} />
        <StudentManager classList={myClasses} />
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";

export default function ClassPage({ classObj, assignments, canManage }) {
  if (!classObj) {
    return (
      <section className="section-card module-card">
        <h2>Class not found</h2>
      </section>
    );
  }

  return (
    <section className="section-card module-card">
      <div className="section-header">
        <div>
          <h2>{classObj.className}</h2>
          <p className="intro-copy">{classObj.description || "Class workspace for assignments and materials."}</p>
          <p className="mini-label">Join Code: <strong>{classObj.classCode}</strong></p>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="mini-card">
          <h3>Class Overview</h3>
          <ul className="list-clean">
            <li>Subject: {classObj.subject || "General"}</li>
            <li>Students enrolled: {classObj.students?.length ?? 0}</li>
            <li>Assignments: {assignments.length}</li>
            <li>Created: {new Date(classObj.createdAt).toLocaleDateString()}</li>
          </ul>
        </article>

        <article className="mini-card">
          <h3>Assignments</h3>
          {assignments.length === 0 ? (
            <p>No assignments posted yet.</p>
          ) : (
            <ul className="list-clean">
              {assignments.map((item) => (
                <li key={item.assignmentId}>
                  <Link className="user-link" to={`/classes/${classObj.classId}/assignments/${item.assignmentId}`}>
                    {item.title}
                  </Link>
                  {item.dueDate && <p className="mini-label">Due: {item.dueDate}</p>}
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="mini-card">
          <h3>Next Actions</h3>
          <ul className="list-clean">
            <li><Link className="user-link" to="/study-assistant">Open Study Assistant</Link></li>
            {canManage && <li><Link className="user-link" to="/teacher">Add assignment materials</Link></li>}
          </ul>
        </article>
      </div>
    </section>
  );
}

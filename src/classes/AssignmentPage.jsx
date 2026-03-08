import { Link } from "react-router-dom";

function getMaterialSnippets(documents, assignmentId) {
  return Object.values(documents ?? {})
    .filter((item) => item.assignmentId === assignmentId)
    .slice(0, 6);
}

export default function AssignmentPage({ classObj, assignment, documents }) {
  if (!classObj || !assignment) {
    return (
      <section className="section-card module-card">
        <h2>Assignment not found</h2>
      </section>
    );
  }

  const snippets = getMaterialSnippets(documents, assignment.assignmentId);

  return (
    <section className="section-card module-card">
      <div className="section-header">
        <div>
          <h2>{assignment.title}</h2>
          <p className="intro-copy">{assignment.description || "Assignment details and context materials."}</p>
        </div>
        <Link
          className="primary-btn"
          to={`/study-assistant?classId=${classObj.classId}&assignmentId=${assignment.assignmentId}`}
        >
          Ask Study Assistant
        </Link>
      </div>

      <div className="dashboard-grid">
        <article className="mini-card">
          <h3>Assignment Details</h3>
          <ul className="list-clean">
            <li>Class: {classObj.className}</li>
            <li>Due date: {assignment.dueDate || "Not set"}</li>
            <li>Files: {assignment.uploadedFiles?.length ?? 0}</li>
          </ul>
          {assignment.teacherNotes && (
            <div className="lesson-note">
              <h4>Teacher Notes</h4>
              <p>{assignment.teacherNotes}</p>
            </div>
          )}
        </article>

        <article className="mini-card">
          <h3>Attached Materials</h3>
          {assignment.uploadedFiles?.length ? (
            <ul className="list-clean">
              {assignment.uploadedFiles.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          ) : (
            <p>No files uploaded for this assignment yet.</p>
          )}
        </article>
      </div>

      <section className="result-card">
        <h3>Extracted Context Preview</h3>
        <p>These chunks are used by the Study Assistant retrieval pipeline for contextual answers.</p>
        {snippets.length === 0 ? (
          <p className="mini-label">No document chunks available yet.</p>
        ) : (
          <div className="study-chunk-list">
            {snippets.map((item) => (
              <article key={item.documentId} className="study-chunk-card">
                <p className="context-label">{item.sectionTitle || item.fileName}</p>
                <p className="mini-label">
                  Source: {item.sourceType || "text"} | Page: {item.pageNumber ?? 1}
                  {item.questionNumber ? ` | Q${item.questionNumber}` : ""}
                </p>
                <p>{item.textContent.slice(0, 260)}...</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

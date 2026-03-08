import { useMemo, useState } from "react";
import { attachAssignmentDocuments, createAssignment } from "../classes/schoolService";
import { processTeacherMaterials } from "./MaterialProcessor";

export default function AssignmentUploader({ teacherId, classes, onSaved }) {
  const [form, setForm] = useState({
    classId: "",
    title: "",
    description: "",
    dueDate: "",
    teacherNotes: ""
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [parserNotes, setParserNotes] = useState([]);

  const classOptions = useMemo(() => classes ?? [], [classes]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setParserNotes([]);
    setLoading(true);

    try {
      const { assignmentId } = createAssignment({
        teacherId,
        classId: form.classId,
        title: form.title,
        description: form.description,
        dueDate: form.dueDate,
        teacherNotes: form.teacherNotes
      });

      const { processedMaterials, notes } = await processTeacherMaterials(files);

      attachAssignmentDocuments({
        assignmentId,
        classId: form.classId,
        files,
        processedMaterials
      });

      setParserNotes(notes);
      setMessage("Assignment saved and indexed for multimodal Study Assistant context.");
      setForm({
        classId: "",
        title: "",
        description: "",
        dueDate: "",
        teacherNotes: ""
      });
      setFiles([]);
      onSaved?.();
    } catch (err) {
      setError(err.message ?? "Could not upload assignment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="mini-card">
      <h3>Upload Assignment Materials</h3>
      <p className="intro-copy">
        Add assignment details, upload files, and NextStep will chunk and index text for contextual AI tutoring.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          Class
          <select
            value={form.classId}
            onChange={(event) => setForm((prev) => ({ ...prev, classId: event.target.value }))}
          >
            <option value="">Select class</option>
            {classOptions.map((item) => (
              <option key={item.classId} value={item.classId}>
                {item.className}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          Assignment title
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Chapter 4 Homework"
          />
        </label>

        <label className="field">
          Description
          <textarea
            className="chat-input"
            rows={3}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="What students should complete and submit."
          />
        </label>

        <label className="field">
          Due date
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
          />
        </label>

        <label className="field">
          Teacher notes
          <textarea
            className="chat-input"
            rows={3}
            value={form.teacherNotes}
            onChange={(event) => setForm((prev) => ({ ...prev, teacherNotes: event.target.value }))}
            placeholder="Hints, grading focus, or reminders for AI context."
          />
        </label>

        <label className="field">
          Files (PNG, JPG, WEBP, PDF, DOCX, TXT)
          <input
            type="file"
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          />
        </label>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="feedback">{message}</p>}
        {parserNotes.length > 0 && (
          <ul className="list-clean">
            {parserNotes.map((note) => (
              <li key={note} className="mini-label">{note}</li>
            ))}
          </ul>
        )}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Save Assignment"}
        </button>
      </form>
    </article>
  );
}

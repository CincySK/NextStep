export default function AssignmentSelector({
  classes,
  assignmentsByClass,
  selectedClassId,
  selectedAssignmentId,
  onClassChange,
  onAssignmentChange
}) {
  const classAssignments = selectedClassId ? assignmentsByClass[selectedClassId] ?? [] : [];

  return (
    <div className="chat-assignment-row">
      <label className="field">
        Class Context
        <select
          value={selectedClassId}
          onChange={(event) => onClassChange(event.target.value)}
        >
          <option value="">General question (no class)</option>
          {classes.map((item) => (
            <option key={item.classId} value={item.classId}>
              {item.className}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Assignment (optional)
        <select
          value={selectedAssignmentId}
          onChange={(event) => onAssignmentChange(event.target.value)}
          disabled={!selectedClassId}
        >
          <option value="">Auto-detect from question</option>
          {classAssignments.map((item) => (
            <option key={item.assignmentId} value={item.assignmentId}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

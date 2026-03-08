export default function StudentManager({ classList = [] }) {
  return (
    <article className="mini-card">
      <h3>Students</h3>
      {classList.length === 0 ? (
        <p>Create a class to start inviting students.</p>
      ) : (
        <div className="study-chunk-list">
          {classList.map((item) => (
            <article className="study-chunk-card" key={item.classId}>
              <p className="context-label">{item.className}</p>
              <p>{item.students?.length ?? 0} student(s) joined</p>
              <p className="mini-label">Class Code: <strong>{item.classCode}</strong></p>
            </article>
          ))}
        </div>
      )}
    </article>
  );
}

import { useState } from "react";
import { joinClass } from "./schoolService";

export default function JoinClass({ userId, onJoined }) {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleJoin(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      joinClass({ userId, classCode });
      setMessage("Class joined. You can open it from My Classes.");
      setClassCode("");
      onJoined?.();
    } catch (err) {
      setError(err.message ?? "Could not join class.");
    }
  }

  return (
    <article className="mini-card">
      <h3>Join a Class</h3>
      <p className="intro-copy">Enter a teacher-provided class code to access assignments and materials.</p>
      <form className="auth-form" onSubmit={handleJoin}>
        <label className="field" htmlFor="join-code">
          Class code
          <input
            id="join-code"
            value={classCode}
            onChange={(event) => setClassCode(event.target.value.toUpperCase())}
            placeholder="Example: A1B2C3"
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="feedback">{message}</p>}
        <button className="primary-btn" type="submit" disabled={!classCode.trim()}>
          Join Class
        </button>
      </form>
    </article>
  );
}

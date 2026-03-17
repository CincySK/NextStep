function renderMessageText(text) {
  const blocks = String(text ?? "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block.split("\n").map((item) => item.trim()).filter(Boolean);
    const isList = lines.length > 1 && lines.every((line) => /^(\d+\.)|[-*]/.test(line));

    if (isList) {
      return (
        <ul key={`${block}_${index}`} className="list-clean">
          {lines.map((line) => (
            <li key={line} className="mini-label">{line.replace(/^(\d+\.)\s*|^[-*]\s*/, "")}</li>
          ))}
        </ul>
      );
    }

    return <p key={`${block}_${index}`}>{block}</p>;
  });
}

export default function ChatMessage({ role, text, timestamp, context, attachments = [] }) {
  const isUser = role === "user";

  return (
    <article className={`chat-message ${isUser ? "chat-message-user" : "chat-message-assistant"}`}>
      <header className="chat-message-head">
        <strong>{isUser ? "You" : "NextStep AI Tutor"}</strong>
        {timestamp && <span>{new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
      </header>
      {!isUser && context?.assistantTag && (
        <p className="chat-intent-badge">{context.assistantTag}</p>
      )}
      {renderMessageText(text)}
      {attachments.length > 0 && (
        <div className="chat-attachment-list">
          {attachments.map((item) => (
            <article key={item.id ?? item.name} className="chat-attachment-item">
              {item.previewUrl && item.mimeType?.startsWith("image/") ? (
                <img src={item.previewUrl} alt={item.name} className="chat-attachment-image" />
              ) : (
                <span className="context-label">{item.name}</span>
              )}
            </article>
          ))}
        </div>
      )}
      {!isUser && context?.className && (
        <p className="chat-context-note">
          Context: {context.className}{context.assignmentTitle ? ` / ${context.assignmentTitle}` : ""}
          {context?.usedClassContext ? " (Using class context)" : ""}
        </p>
      )}
      {!isUser && context?.attachmentNotes?.length > 0 && (
        <ul className="list-clean">
          {context.attachmentNotes.map((note) => (
            <li key={note} className="mini-label">{note}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

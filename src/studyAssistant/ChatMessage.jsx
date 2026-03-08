export default function ChatMessage({ role, text, timestamp, context, attachments = [] }) {
  const isUser = role === "user";

  return (
    <article className={`chat-message ${isUser ? "chat-message-user" : "chat-message-assistant"}`}>
      <header className="chat-message-head">
        <strong>{isUser ? "You" : "NextStep Tutor"}</strong>
        {timestamp && <span>{new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
      </header>
      <p>{text}</p>
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

export default function FileAttachmentPreview({ items, onRemove }) {
  if (!items?.length) return null;

  return (
    <div className="attachment-preview-list">
      {items.map((item) => (
        <article key={item.id} className="attachment-preview-card">
          {item.previewUrl && item.mimeType?.startsWith("image/") ? (
            <img src={item.previewUrl} alt={item.name} className="attachment-preview-image" />
          ) : (
            <div className="attachment-preview-fallback">{item.name.split(".").pop()?.toUpperCase() || "FILE"}</div>
          )}
          <div>
            <p className="attachment-name">{item.name}</p>
            <p className="mini-label">
              {Math.round(item.size / 1024)} KB
              {item.mimeType?.startsWith("image/") ? " | Image" : " | File"}
            </p>
          </div>
          <button type="button" className="mini-action" onClick={() => onRemove(item.id)}>
            Remove
          </button>
        </article>
      ))}
    </div>
  );
}

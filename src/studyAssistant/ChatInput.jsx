import { useMemo, useRef } from "react";
import { validateUploadFile } from "../documents/FileTypeDetector";
import FileAttachmentPreview from "./FileAttachmentPreview";

const suggestions = [
  "Help me with math",
  "Improve my essay",
  "Explain this concept",
  "Study for a test"
];

function createAttachment(file) {
  const id = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : "";
  return {
    id,
    file,
    name: file.name,
    size: file.size,
    mimeType: file.type,
    previewUrl
  };
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  loading,
  attachments,
  setAttachments,
  useClassContext,
  onToggleClassContext,
  uploadError,
  setUploadError
}) {
  const inputRef = useRef(null);
  const hasAttachments = useMemo(() => attachments?.length > 0, [attachments]);

  function addSelectedFiles(selected = []) {
    if (selected.length === 0) return;

    const nextItems = [];
    for (const file of selected) {
      const validation = validateUploadFile(file);
      if (!validation.ok) {
        setUploadError(validation.reason);
        continue;
      }
      nextItems.push(createAttachment(file));
    }

    if (nextItems.length > 0) {
      setUploadError("");
      setAttachments((prev) => [...prev, ...nextItems].slice(0, 4));
    }
  }

  function handleFilesSelected(event) {
    const selected = Array.from(event.target.files ?? []);
    addSelectedFiles(selected);
    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    const dropped = Array.from(event.dataTransfer?.files ?? []);
    addSelectedFiles(dropped);
  }

  function removeAttachment(id) {
    setAttachments((prev) => {
      const found = prev.find((item) => item.id === id);
      if (found?.previewUrl) URL.revokeObjectURL(found.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  }

  return (
    <form className="chat-input-wrap" onSubmit={onSubmit}>
      <div className="chip-row">
        {suggestions.map((item) => (
          <button
            key={item}
            type="button"
            className="chip"
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="chat-tools-row">
        <button
          type="button"
          className="secondary-btn"
          onClick={() => inputRef.current?.click()}
        >
          Attach image/file
        </button>
        <label className="chat-context-toggle">
          <input
            type="checkbox"
            checked={useClassContext}
            onChange={(event) => onToggleClassContext(event.target.checked)}
          />
          <span>Use my class context</span>
        </label>
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept=".png,.jpg,.jpeg,.webp,.pdf,.txt,.md,.docx"
          onChange={handleFilesSelected}
        />
        {hasAttachments && (
          <button
            type="button"
            className="mini-action"
            onClick={() => {
              attachments.forEach((item) => {
                if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
              });
              setAttachments([]);
            }}
          >
            Clear attachments
          </button>
        )}
      </div>

      <div
        className="chat-dropzone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        Drag and drop worksheet images, screenshots, or scanned PDFs here.
      </div>
      <p className="chat-input-hint">
        Try: simplify 6/8, explain photosynthesis, improve this sentence, or help with question 4a.
      </p>

      <FileAttachmentPreview items={attachments} onRemove={removeAttachment} />
      {uploadError && <p className="auth-error">{uploadError}</p>}

      <div className="chat-input-row">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ask a question about homework, writing, math, or upload a worksheet screenshot..."
          className="chat-input"
          rows={3}
        />
        <button
          className="primary-btn chat-send-btn"
          type="submit"
          disabled={loading || (!value.trim() && !hasAttachments)}
        >
          {loading ? "Analyzing..." : "Send"}
        </button>
      </div>
    </form>
  );
}

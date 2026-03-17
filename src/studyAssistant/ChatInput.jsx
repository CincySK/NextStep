import { useMemo, useRef } from "react";
import { validateUploadFile } from "../documents/FileTypeDetector";
import FileAttachmentPreview from "./FileAttachmentPreview";

const suggestions = [
  "Explain step-by-step",
  "Give simpler explanation",
  "Show example",
  "Explain photosynthesis"
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

  function applySuggestion(item) {
    const trimmed = value.trim();
    if (item === "Explain step-by-step") {
      onChange(trimmed ? `${trimmed}\n\nPlease explain this step-by-step.` : "Please explain this step-by-step:");
      return;
    }
    if (item === "Give simpler explanation") {
      onChange(trimmed ? `${trimmed}\n\nPlease give a simpler explanation.` : "Please give a simpler explanation for:");
      return;
    }
    if (item === "Show example") {
      onChange(trimmed ? `${trimmed}\n\nPlease show one clear example.` : "Please show one clear example for:");
      return;
    }
    onChange(item);
  }

  return (
    <form className="chat-input-wrap" onSubmit={onSubmit}>
      <div className="chip-row">
        {suggestions.map((item) => (
          <button
            key={item}
            type="button"
            className="chip"
            onClick={() => applySuggestion(item)}
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
        Try asking: 5/10, explain photosynthesis, help me write an essay about space, or help with question 4a.
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
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </form>
  );
}

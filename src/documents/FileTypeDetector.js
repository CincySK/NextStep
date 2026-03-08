const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function getUploadLimits() {
  return {
    maxBytes: MAX_UPLOAD_BYTES,
    supportedMimeTypes: [
      ...IMAGE_TYPES,
      "application/pdf",
      "text/plain",
      "text/markdown",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
  };
}

export function detectFileType(file) {
  const type = String(file?.type ?? "").toLowerCase();
  const name = String(file?.name ?? "").toLowerCase();

  if (IMAGE_TYPES.includes(type) || /\.(png|jpg|jpeg|webp)$/i.test(name)) {
    return { fileType: "image", sourceType: "ocr", isImage: true, isPdf: false, isText: false };
  }

  if (type === "application/pdf" || /\.pdf$/i.test(name)) {
    return { fileType: "pdf", sourceType: "ocr", isImage: false, isPdf: true, isText: false };
  }

  if (
    type.startsWith("text/")
    || /\.(txt|md|csv|json)$/i.test(name)
    || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    || /\.docx$/i.test(name)
  ) {
    return { fileType: "text", sourceType: "text", isImage: false, isPdf: false, isText: true };
  }

  return { fileType: "unknown", sourceType: "unknown", isImage: false, isPdf: false, isText: false };
}

export function validateUploadFile(file) {
  if (!file) return { ok: false, reason: "No file selected." };
  const limits = getUploadLimits();
  if (file.size > limits.maxBytes) {
    return { ok: false, reason: `File "${file.name}" exceeds 10 MB limit.` };
  }
  const kind = detectFileType(file);
  if (kind.fileType === "unknown") {
    return { ok: false, reason: `Unsupported file type for "${file.name}".` };
  }
  return { ok: true, kind };
}

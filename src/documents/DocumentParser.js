function sanitizeText(text) {
  return String(text ?? "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function parsePdfOrDocxBestEffort(file) {
  const buffer = await file.arrayBuffer();
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const raw = decoder.decode(buffer);
  const sanitized = sanitizeText(raw);
  return sanitized;
}

export async function parseUploadedDocument(file) {
  if (!file) return { text: "", parserNote: "No file provided." };

  const lowerName = file.name.toLowerCase();
  const isTextLike = file.type.startsWith("text/") || /\.(txt|md|csv|json)$/i.test(lowerName);
  const isDoc = /\.(docx|pdf)$/i.test(lowerName);
  const isImage = file.type.startsWith("image/") || /\.(png|jpg|jpeg|webp)$/i.test(lowerName);

  if (isTextLike) {
    const text = sanitizeText(await file.text());
    return { text, parserNote: "Parsed as plain text." };
  }

  if (isDoc) {
    const text = await parsePdfOrDocxBestEffort(file);
    return {
      text,
      parserNote: "Best-effort extraction for PDF/DOCX. For best results, include assignment instructions text."
    };
  }

  if (isImage) {
    return {
      text: "",
      parserNote: "Image file detected. OCR/image understanding is handled by multimodal processors."
    };
  }

  return {
    text: "",
    parserNote: "Unsupported file type. Upload TXT/MD/CSV or include manual instructions."
  };
}

import { detectFileType } from "../documents/FileTypeDetector";

function sanitizeText(text) {
  return String(text ?? "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function bestEffortDecode(file) {
  try {
    if (typeof file.text === "function") {
      const text = await file.text();
      return sanitizeText(text);
    }
  } catch {
    // Continue to arrayBuffer fallback.
  }
  try {
    if (typeof file.arrayBuffer === "function") {
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder("utf-8", { fatal: false });
      return sanitizeText(decoder.decode(buffer));
    }
  } catch {
    return "";
  }
  return "";
}

function inferFromFileName(fileName) {
  const lower = String(fileName ?? "").toLowerCase();
  if (/q\d|question|worksheet|homework/.test(lower)) {
    return "Likely worksheet content with numbered questions.";
  }
  if (/graph|chart|diagram/.test(lower)) {
    return "Likely visual diagram or graph-based content.";
  }
  if (/essay|writing|paragraph/.test(lower)) {
    return "Likely writing or essay draft content.";
  }
  if (/math|algebra|geometry|calculus|equation/.test(lower)) {
    return "Likely math-focused work.";
  }
  return "";
}

export async function extractTextFromFile(file) {
  const kind = detectFileType(file);
  const decoded = await bestEffortDecode(file);

  if (kind.fileType === "text") {
    return {
      extractedText: decoded,
      confidence: decoded ? 0.95 : 0.4,
      sourceType: "text",
      note: decoded ? "Text extracted from document." : "Text extraction returned low content."
    };
  }

  if (kind.fileType === "pdf") {
    return {
      extractedText: decoded,
      confidence: decoded ? 0.55 : 0.25,
      sourceType: decoded ? "text" : "ocr",
      note: decoded
        ? "Best-effort PDF text extraction complete."
        : "Image-based PDF detected. OCR confidence is limited in local mode."
    };
  }

  if (kind.fileType === "image") {
    const hint = inferFromFileName(file?.name);
    return {
      extractedText: hint,
      confidence: hint ? 0.35 : 0.18,
      sourceType: "ocr",
      note: hint
        ? "Image OCR used filename/context heuristics. Upload clearer crops or type key text for higher accuracy."
        : "Image OCR confidence is low. Upload a clearer image, crop one question, or include typed text."
    };
  }

  return {
    extractedText: "",
    confidence: 0,
    sourceType: "unknown",
    note: "Unsupported file for OCR extraction."
  };
}

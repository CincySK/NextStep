import { detectFileType } from "../documents/FileTypeDetector";
import { extractTextFromFile } from "./OCRService";

async function readImageMetadata(file) {
  if (typeof URL === "undefined" || !file || !file.type?.startsWith("image/")) {
    return { width: null, height: null };
  }

  return new Promise((resolve) => {
    const src = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const width = image.naturalWidth || null;
      const height = image.naturalHeight || null;
      URL.revokeObjectURL(src);
      resolve({ width, height });
    };
    image.onerror = () => {
      URL.revokeObjectURL(src);
      resolve({ width: null, height: null });
    };
    image.src = src;
  });
}

function inferVisualIntent(question, fileName) {
  const text = `${question ?? ""} ${fileName ?? ""}`.toLowerCase();
  if (/handwrite|show my work|where did i go wrong|mistake|algebra|equation|solve|math/.test(text)) return "handwritten-math";
  if (/graph|chart|axis|diagram|label/.test(text)) return "diagram-chart";
  if (/essay|paragraph|grammar|rewrite|thesis/.test(text)) return "writing";
  if (/question|worksheet|homework|4a|6a|6b/.test(text)) return "worksheet";
  return "general";
}

function detectQuestionRefs(text) {
  const refs = [];
  const matches = String(text ?? "").toLowerCase().match(/(?:question|q)\s*(\d+[a-z]?)/g) ?? [];
  matches.forEach((token) => {
    const normalized = token.replace(/(?:question|q)\s*/g, "").trim();
    if (normalized) refs.push(normalized);
  });
  const shortMatches = String(text ?? "").toLowerCase().match(/\b(\d+[a-z])\b/g) ?? [];
  shortMatches.forEach((token) => refs.push(token.trim()));
  return Array.from(new Set(refs));
}

function buildSummary({ intent, metadata, ocr }) {
  const resolution = metadata.width && metadata.height
    ? `${metadata.width}x${metadata.height}`
    : "unknown resolution";

  if (intent === "handwritten-math") {
    return `This looks like handwritten math work (${resolution}). I can review likely algebra/calculation steps, but some handwriting may be unclear.`;
  }
  if (intent === "diagram-chart") {
    return `This appears to be a visual diagram or chart (${resolution}). I can help interpret labels, trends, and what the figure likely represents.`;
  }
  if (intent === "writing") {
    return `This seems to contain writing content (${resolution}). I can help with clarity, structure, grammar, and stronger phrasing.`;
  }
  if (intent === "worksheet") {
    return `This appears to be worksheet-style content (${resolution}). I can help identify question context and work through it step by step.`;
  }
  return ocr.extractedText
    ? `I detected some readable content from this file and can guide you with context-aware hints.`
    : `I can analyze this visual content, but OCR confidence is limited.`;
}

export async function analyzeVisualAttachment({ file, studentQuestion }) {
  const kind = detectFileType(file);
  const ocr = await extractTextFromFile(file);
  const metadata = await readImageMetadata(file);
  const intent = inferVisualIntent(studentQuestion, file?.name);

  const confidence = Math.max(0.1, Math.min(0.95, (ocr.confidence * 0.7) + (kind.fileType === "image" ? 0.15 : 0.05)));
  const questionRefs = detectQuestionRefs(`${studentQuestion ?? ""} ${file?.name ?? ""} ${ocr.extractedText ?? ""}`);
  const handwritingLikely = /hand|show my work|scratch|notebook|steps/i.test(`${studentQuestion ?? ""} ${file?.name ?? ""}`);
  const handwritingConfidence = handwritingLikely ? Math.max(0.2, confidence - 0.12) : null;
  const uncertaintyNote = confidence < 0.45
    ? "Some parts may be unclear. Upload a sharper crop or type the exact question text for higher accuracy."
    : "";

  return {
    fileName: file?.name ?? "attachment",
    mimeType: file?.type ?? "",
    fileType: kind.fileType,
    intent,
    confidence,
    extractedText: ocr.extractedText,
    summary: buildSummary({ intent, metadata, ocr }),
    uncertaintyNote,
    questionRefs,
    handwritingLikely,
    handwritingConfidence,
    imageMetadata: metadata,
    sourceType: ocr.sourceType
  };
}

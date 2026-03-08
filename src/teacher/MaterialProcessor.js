import { chunkText } from "../documents/ChunkProcessor";
import { detectFileType, validateUploadFile } from "../documents/FileTypeDetector";
import { processWithOCR } from "../documents/OCRProcessor";
import { summarizeImagePage } from "../documents/ImagePageSummarizer";

function extractQuestionNumber(text) {
  const content = String(text ?? "").toLowerCase();
  const explicit = content.match(/(?:question|q)\s*(\d+[a-z]?)/i);
  if (explicit) return explicit[1];
  const match = content.match(/\b(\d+[a-z])\b/i) ?? content.match(/\b(\d{1,2})\b/);
  return match ? match[1] : null;
}

function buildChunkRecords({ chunks, pageNumber, sectionTitle, sourceType, fileType }) {
  return chunks.map((text, index) => ({
    textContent: text,
    pageNumber,
    sectionTitle: `${sectionTitle} - part ${index + 1}`,
    sourceType,
    fileType,
    questionNumber: extractQuestionNumber(text)
  }));
}

export async function processTeacherMaterials(files = []) {
  const processedMaterials = [];
  const notes = [];

  for (const file of files) {
    const validation = validateUploadFile(file);
    if (!validation.ok) {
      notes.push(`${file.name}: ${validation.reason}`);
      continue;
    }

    const kind = detectFileType(file);
    const ocr = await processWithOCR(file);
    const imageSummary = kind.isImage || kind.isPdf
      ? await summarizeImagePage(file, file.name)
      : null;

    const baseText = [ocr.extractedText, imageSummary?.summary].filter(Boolean).join("\n");
    const chunks = chunkText(baseText, 120, 24);
    const chunkRecords = buildChunkRecords({
      chunks,
      pageNumber: 1,
      sectionTitle: file.name,
      sourceType: kind.isImage ? "image-summary" : (kind.isPdf ? "ocr" : (ocr.sourceType || "text")),
      fileType: kind.fileType
    });

    processedMaterials.push({
      fileName: file.name,
      mimeType: file.type,
      fileType: kind.fileType,
      extractedText: ocr.extractedText,
      pageSummaries: imageSummary ? [imageSummary.summary] : [],
      imageMetadata: imageSummary ? [imageSummary.imageMetadata] : [],
      chunks: chunkRecords
    });

    notes.push(`${file.name}: ${ocr.note}${imageSummary?.uncertaintyNote ? ` ${imageSummary.uncertaintyNote}` : ""}`);
  }

  return { processedMaterials, notes };
}

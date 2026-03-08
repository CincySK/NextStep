import { extractTextFromFile } from "../ai/OCRService";

export async function processWithOCR(file) {
  const result = await extractTextFromFile(file);
  return {
    extractedText: result.extractedText,
    sourceType: result.sourceType,
    confidence: result.confidence,
    note: result.note
  };
}

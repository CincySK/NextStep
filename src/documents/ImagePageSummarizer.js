import { analyzeVisualAttachment } from "../ai/ImageUnderstandingService";

export async function summarizeImagePage(file, promptHint = "") {
  const analysis = await analyzeVisualAttachment({
    file,
    studentQuestion: promptHint
  });
  return {
    summary: analysis.summary,
    confidence: analysis.confidence,
    intent: analysis.intent,
    uncertaintyNote: analysis.uncertaintyNote,
    imageMetadata: analysis.imageMetadata
  };
}

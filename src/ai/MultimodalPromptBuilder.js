export function buildMultimodalContext({
  message,
  assignmentContext,
  attachmentAnalyses = [],
  useClassContext = true
}) {
  const attachmentSummary = attachmentAnalyses.map((item) => ({
    fileName: item.fileName,
    intent: item.intent,
    confidence: item.confidence,
    extractedText: item.extractedText,
    summary: item.summary,
    uncertaintyNote: item.uncertaintyNote,
    questionRefs: item.questionRefs ?? [],
    handwritingLikely: item.handwritingLikely ?? false
  }));

  const lowConfidenceCount = attachmentSummary.filter((item) => item.confidence < 0.45).length;
  const attachmentQuestionRefs = Array.from(
    new Set(attachmentSummary.flatMap((item) => item.questionRefs ?? []))
  );

  return {
    studentQuestion: message,
    useClassContext,
    assignmentTitle: useClassContext ? assignmentContext?.assignmentTitle ?? null : null,
    className: useClassContext ? assignmentContext?.className ?? null : null,
    relevantAssignmentChunks: useClassContext ? assignmentContext?.relevantChunks ?? [] : [],
    attachmentSummary,
    lowConfidenceCount,
    attachmentQuestionRefs
  };
}

import { analyzeVisualAttachment } from "./ImageUnderstandingService";
import { buildAIContext } from "./ContextBuilder";
import { buildMultimodalContext } from "./MultimodalPromptBuilder";
import { routeLocalAssistant } from "../studyAssistant/studyAssistantRouter";

function summarizeAttachments(multimodalContext) {
  if (!multimodalContext?.attachmentSummary?.length) return [];
  return multimodalContext.attachmentSummary.map((item) => {
    const confidence = Math.round((item.confidence ?? 0) * 100);
    const lowConfidence = item.confidence < 0.45
      ? " Some parts may be unclear; upload a clearer crop if needed."
      : "";
    return `${item.fileName}: ${item.summary} (confidence ${confidence}%).${lowConfidence}`;
  });
}

function fallbackDiagramHelp(multimodalContext, context) {
  const first = multimodalContext?.attachmentSummary?.[0];
  return {
    text: [
      first ? `I reviewed your visual: ${first.summary}` : "I can help interpret your diagram or chart.",
      "To answer clearly, share either the graph title/axis labels or the exact question text.",
      context?.assignmentTitle ? `I can also align this with your assignment: ${context.assignmentTitle}.` : ""
    ].filter(Boolean).join("\n"),
    assistantTag: "Diagram Help"
  };
}

export async function generateTutorReply({
  message,
  classId,
  selectedAssignmentId,
  useClassContext = true,
  attachmentFiles = [],
  school,
  user,
  recentHistory = []
}) {
  const attachmentAnalyses = [];
  for (const file of attachmentFiles) {
    const analysis = await analyzeVisualAttachment({ file, studentQuestion: message });
    attachmentAnalyses.push(analysis);
  }

  const multimodalContext = buildMultimodalContext({
    message,
    assignmentContext: null,
    attachmentAnalyses,
    useClassContext
  });

  const context = buildAIContext({
    message,
    classId,
    selectedAssignmentId,
    useClassContext,
    attachmentQuestionRefs: multimodalContext.attachmentQuestionRefs,
    school,
    user
  });

  const routed = routeLocalAssistant({
    message,
    recentHistory,
    useClassContext,
    context
  });

  const finalResponse = routed.assistantTag === "Clarification" && attachmentAnalyses.length > 0
    ? fallbackDiagramHelp(multimodalContext, context)
    : routed;

  return {
    text: finalResponse.text,
    context: {
      ...context,
      assistantTag: finalResponse.assistantTag,
      usedClassContext: Boolean(finalResponse.usedClassContext),
      attachmentNotes: summarizeAttachments(multimodalContext),
      multimodal: multimodalContext
    }
  };
}

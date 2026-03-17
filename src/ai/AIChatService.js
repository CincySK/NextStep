import { analyzeVisualAttachment } from "./ImageUnderstandingService";
import { buildAIContext } from "./ContextBuilder";
import { buildMultimodalContext } from "./MultimodalPromptBuilder";

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

const LOCAL_AI_ENDPOINT = import.meta.env.VITE_AI_API_URL || "http://localhost:3001/api/chat";

async function requestLocalTutor({ message, context, recentHistory, attachmentNotes }) {
  const response = await fetch(LOCAL_AI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      context,
      recentHistory: recentHistory.map((item) => ({
        role: item.role,
        text: item.text,
        context: item.context ?? null
      })),
      attachmentNotes
    })
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(data.error || "The local tutor request failed.");
    error.code = response.status === 503 ? "OLLAMA_UNAVAILABLE" : "LOCAL_TUTOR_ERROR";
    throw error;
  }

  return {
    text: String(data.reply ?? "").trim(),
    assistantTag: data.assistantTag || "AI Tutor"
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
  const attachmentNotes = summarizeAttachments(multimodalContext);
  let finalResponse;

  try {
    finalResponse = await requestLocalTutor({
      message,
      context,
      recentHistory,
      attachmentNotes
    });
  } catch (error) {
    if (attachmentAnalyses.length > 0 && error.code !== "OLLAMA_UNAVAILABLE") {
      finalResponse = fallbackDiagramHelp(multimodalContext, context);
    } else {
      throw error;
    }
  }

  return {
    text: finalResponse.text,
    context: {
      ...context,
      assistantTag: finalResponse.assistantTag,
      usedClassContext: Boolean(finalResponse.usedClassContext),
      attachmentNotes,
      multimodal: multimodalContext
    }
  };
}

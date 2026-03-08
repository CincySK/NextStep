import { analyzeVisualAttachment } from "./ImageUnderstandingService";
import { buildAIContext } from "./ContextBuilder";
import { buildMultimodalContext } from "./MultimodalPromptBuilder";

function detectIntent(message, attachmentAnalyses = []) {
  const text = String(message ?? "").toLowerCase();
  const attachmentIntent = attachmentAnalyses[0]?.intent ?? "";
  if (/equation|solve|math|algebra|geometry|calculus|number/.test(text) || attachmentIntent === "handwritten-math") return "math";
  if (/essay|paragraph|rewrite|grammar|thesis|writing/.test(text) || attachmentIntent === "writing") return "writing";
  if (/test|study|review|quiz prep/.test(text)) return "study";
  if (/graph|chart|diagram/.test(text) || attachmentIntent === "diagram-chart") return "diagram";
  if (/explain|concept|understand|what is|how does/.test(text)) return "concept";
  return "homework";
}

function formatChunkSummary(chunks) {
  if (!chunks || chunks.length === 0) return "";
  return chunks.slice(0, 3).map((chunk) => `- ${chunk.slice(0, 180)}...`).join("\n");
}

function buildAttachmentNotes(multimodalContext) {
  if (!multimodalContext.attachmentSummary?.length) return [];
  return multimodalContext.attachmentSummary.map((item) => {
    const confidence = Math.round((item.confidence ?? 0) * 100);
    const uncertainty = item.uncertaintyNote ? ` ${item.uncertaintyNote}` : "";
    const refs = item.questionRefs?.length ? ` Detected question refs: ${item.questionRefs.join(", ")}.` : "";
    return `${item.fileName}: ${item.summary} (confidence ${confidence}%).${refs}${uncertainty}`;
  });
}

function detectLikelyMathError(multimodalContext) {
  const text = multimodalContext.attachmentSummary
    .map((item) => item.extractedText ?? "")
    .join(" ")
    .toLowerCase();

  if (!text) return "";
  if (/\-\s*\-/.test(text)) return "I noticed a possible double-negative/sign handling issue in one step.";
  if (/\=\s*\d+\s*\/?\s*0/.test(text)) return "There may be a divide-by-zero or undefined step to check.";
  if (/\)\s*\(/.test(text)) return "Check distribution between adjacent parentheses terms.";
  if (/\^2|square|squared/.test(text)) return "Check exponent handling when moving terms across the equation.";
  return "";
}

function buildMathResponse(context, multimodalContext) {
  const contextualLine = context.relevantChunks.length > 0
    ? `I found relevant assignment context${context.assignmentTitle ? ` from \"${context.assignmentTitle}\"` : ""}.`
    : "I can still guide you step by step even without assignment materials.";

  const attachmentHint = multimodalContext.attachmentSummary.length > 0
    ? "I reviewed your uploaded work and will point out likely error points before final answers."
    : "";

  const uncertaintyPrompt = multimodalContext.lowConfidenceCount > 0
    ? "Some handwriting or image text is unclear. If possible, upload a clearer crop of the specific line where you are stuck."
    : "";

  const errorHint = detectLikelyMathError(multimodalContext);
  const questionRefHint = multimodalContext.attachmentQuestionRefs?.length > 0
    ? `I matched your upload to question ${multimodalContext.attachmentQuestionRefs[0]} and prioritized that context.`
    : "";

  return [
    `Great question. Let us break this down step by step${context.assignmentTitle ? ` for \"${context.assignmentTitle}\"` : ""}.`,
    contextualLine,
    questionRefHint,
    attachmentHint,
    errorHint,
    "1. First identify what the problem is asking.",
    "2. Write the known values or equation.",
    "3. Compare each transformation step for sign/arithmetic errors.",
    "4. Check your result in the original question.",
    context.relevantChunks.length > 0 ? `From your class materials, this looks relevant:\n${formatChunkSummary(context.relevantChunks)}` : "",
    uncertaintyPrompt,
    "Share the exact step you want checked and I will pinpoint where the mistake likely happened."
  ].filter(Boolean).join("\n\n");
}

function buildWritingResponse(context, multimodalContext) {
  const attachmentHint = multimodalContext.attachmentSummary.length > 0
    ? "I can revise text from your screenshot while keeping your original meaning and voice."
    : "";

  return [
    "Nice start. I can help you improve this without losing your own voice.",
    attachmentHint,
    "Try this structure:",
    "- Clear thesis (1 sentence)",
    "- 2-3 body points with evidence",
    "- Short conclusion connecting back to your thesis",
    context.assignmentDescription ? `Your assignment focus appears to be: \"${context.assignmentDescription}\".` : "",
    "Paste or type one paragraph and I can suggest a stronger version plus explain why."
  ].filter(Boolean).join("\n\n");
}

function buildConceptResponse(context, multimodalContext) {
  const attachmentHint = multimodalContext.attachmentSummary.length > 0
    ? "I also used your uploaded visual to shape this explanation."
    : "";

  return [
    "Let us make this concept easier.",
    attachmentHint,
    "I will explain it in 3 layers:",
    "1. Simple definition",
    "2. Real-world example",
    "3. How it appears in class problems",
    context.relevantChunks.length > 0 ? `Class context hints:\n${formatChunkSummary(context.relevantChunks)}` : "",
    context.relevantVisualSummaries?.length ? `Visual context hints:\n- ${context.relevantVisualSummaries.join("\n- ")}` : "",
    "Tell me which part is still confusing and we will simplify further."
  ].filter(Boolean).join("\n\n");
}

function buildDiagramResponse(context, multimodalContext) {
  const first = multimodalContext.attachmentSummary[0];
  const confidenceMessage = first && first.confidence < 0.45
    ? "The image is partly unclear, so I may miss fine labels."
    : "";

  return [
    "I can help interpret this diagram/chart in student-friendly terms.",
    first ? `What I can see: ${first.summary}` : "Upload the chart or diagram image and I can break it down.",
    confidenceMessage,
    "Try this reading order:",
    "1. Identify title, axis labels, legend, and units",
    "2. Find biggest trend/contrast and possible cause",
    "3. Connect pattern to the class topic and assignment question",
    context.relevantChunks.length > 0 ? `Related assignment context:\n${formatChunkSummary(context.relevantChunks)}` : "",
    context.relevantVisualSummaries?.length ? `Related visual notes:\n- ${context.relevantVisualSummaries.join("\n- ")}` : ""
  ].filter(Boolean).join("\n\n");
}

function buildStudyResponse() {
  return [
    "Here is a quick study plan:",
    "1. 20 min concept review",
    "2. 20 min practice questions",
    "3. 10 min error review",
    "4. 10 min self-quiz without notes",
    "Want me to generate a custom 30-minute review plan for your next test?"
  ].join("\n\n");
}

function buildHomeworkResponse(context, multimodalContext) {
  const attachmentHint = multimodalContext.attachmentSummary.length > 0
    ? "I reviewed your uploaded file and can guide you through the visible question."
    : "";

  const questionRefHint = multimodalContext.attachmentQuestionRefs?.length > 0
    ? `I detected possible worksheet question references: ${multimodalContext.attachmentQuestionRefs.join(", ")}.`
    : "";

  return [
    `I can help you work through this${context.assignmentTitle ? ` from \"${context.assignmentTitle}\"` : ""} like a tutor, not just hand over the answer.`,
    questionRefHint,
    attachmentHint,
    "Start by sharing the exact question prompt or where you got stuck.",
    "I will guide you with hints first, then step-by-step support."
  ].filter(Boolean).join("\n\n");
}

export async function generateTutorReply({
  message,
  classId,
  selectedAssignmentId,
  useClassContext = true,
  attachmentFiles = [],
  school,
  user
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

  const finalMultimodalContext = buildMultimodalContext({
    message,
    assignmentContext: context,
    attachmentAnalyses,
    useClassContext
  });

  const intent = detectIntent(message, attachmentAnalyses);

  let text;
  if (intent === "math") text = buildMathResponse(context, finalMultimodalContext);
  else if (intent === "writing") text = buildWritingResponse(context, finalMultimodalContext);
  else if (intent === "concept") text = buildConceptResponse(context, finalMultimodalContext);
  else if (intent === "diagram") text = buildDiagramResponse(context, finalMultimodalContext);
  else if (intent === "study") text = buildStudyResponse();
  else text = buildHomeworkResponse(context, finalMultimodalContext);

  return {
    text,
    context: {
      ...context,
      attachmentNotes: buildAttachmentNotes(finalMultimodalContext),
      multimodal: finalMultimodalContext
    }
  };
}

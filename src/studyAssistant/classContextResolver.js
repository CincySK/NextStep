function questionRefFromMessage(message) {
  const lower = String(message ?? "").toLowerCase();
  const match = lower.match(/(?:question|problem)\s*(\d+[a-z]?)/i) ?? lower.match(/\b(\d+[a-z])\b/);
  return match ? match[1] : "";
}

function snippet(text) {
  return String(text ?? "").replace(/\s+/g, " ").trim().slice(0, 180);
}

export function resolveClassQuestion({ message, context }) {
  const ref = questionRefFromMessage(message);
  const chunks = context?.retrievedChunks ?? [];

  if (!context?.className || !context?.assignmentTitle) {
    return {
      needsClarification: true,
      text: "I need class context for that. Select a class/assignment, or paste the exact question text."
    };
  }

  if (chunks.length === 0) {
    return {
      needsClarification: true,
      text: `I could not find enough detail in "${context.assignmentTitle}". Paste the full text of question${ref ? ` ${ref}` : ""} and I will solve it directly.`
    };
  }

  const focused = ref
    ? chunks.find((item) => String(item.questionNumber ?? "").toLowerCase() === ref.toLowerCase())
    : chunks[0];
  const chosen = focused ?? chunks[0];
  return {
    text: [
      `Using class context: ${context.className} / ${context.assignmentTitle}.`,
      ref ? `Matched question ${ref}.` : "Matched the closest assignment section.",
      `Relevant prompt: ${snippet(chosen?.textContent)}`,
      "Tell me your stuck step, and I will guide just that step."
    ].join("\n"),
    usedClassContext: true
  };
}

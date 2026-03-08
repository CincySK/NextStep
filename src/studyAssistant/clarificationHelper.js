export function buildClarifyingQuestion(message, recentHistory = []) {
  const trimmed = String(message ?? "").trim();
  if (!trimmed || /^help$/i.test(trimmed)) {
    return "Tell me one specific thing: solve a math problem, improve writing, explain a concept, or help with a class question.";
  }

  if (/^\d+$/.test(trimmed)) {
    const lastUser = [...recentHistory].reverse().find((item) => item.role === "user" && item.text !== trimmed);
    if (lastUser?.text && /question|problem|worksheet|fraction|equation|solve|simplify/i.test(lastUser.text)) {
      return `Do you mean question ${trimmed}, or a new math expression with ${trimmed}?`;
    }
    return `Do you mean question ${trimmed}, or should I solve a math expression with ${trimmed}?`;
  }

  if (/i don't get it|dont get it/i.test(trimmed.toLowerCase())) {
    return "Which exact part is confusing: the setup, one step, or the final answer?";
  }

  if (/^that one$|^explain that$|^that$/i.test(trimmed)) {
    const lastUser = [...recentHistory].reverse().find((item) => item.role === "user" && item.text !== trimmed);
    if (lastUser?.text) {
      return `Do you want me to explain your previous question: "${lastUser.text.slice(0, 80)}${lastUser.text.length > 80 ? "..." : ""}"?`;
    }
    return "Tell me the exact question you want explained.";
  }

  return "Please share the exact question text so I can give a direct answer.";
}

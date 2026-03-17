import http from "node:http";

const PORT = Number(process.env.AI_SERVER_PORT || 3001);
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";
const MODEL = process.env.OLLAMA_MODEL || "phi3";

const SYSTEM_PROMPT = [
  "You are a highly intelligent tutor for students.",
  "You explain concepts clearly, correctly, and step-by-step.",
  "",
  "Rules:",
  "- Always answer the exact question asked",
  "- Never give generic templates unless asked",
  "- If math, solve step-by-step",
  "- If concept, explain simply and include an example",
  "- If essay, improve writing with explanation",
  "- Be concise but helpful",
  "- If the question is simple, give a simple answer",
  "- If the question is complex, break it down",
  "- If the prompt is vague, ask one short follow-up question instead of guessing",
  "",
  "Format:",
  "1. Direct answer",
  "2. Explanation",
  "3. Example (if useful)"
].join("\n");

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function trimNumberString(value) {
  return String(value)
    .replace(/(\.\d*?[1-9])0+$/, "$1")
    .replace(/\.0+$/, "")
    .replace(/^-0$/, "0");
}

function formatDecimal(value) {
  if (!Number.isFinite(value)) return null;
  return trimNumberString(value.toFixed(6));
}

function normalizeExpression(raw) {
  return raw
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\bplus\b/gi, "+")
    .replace(/\bminus\b/gi, "-")
    .replace(/\bmultiplied by\b/gi, "*")
    .replace(/\btimes\b/gi, "*")
    .replace(/\bdivided by\b/gi, "/")
    .replace(/\s+/g, "");
}

function isSafeArithmeticExpression(expression) {
  return /^[\d+\-*/().]+$/.test(expression) && /[\d)]/.test(expression);
}

function evaluateArithmetic(raw) {
  const expression = normalizeExpression(raw);
  if (!isSafeArithmeticExpression(expression)) return null;

  try {
    const value = Function(`"use strict"; return (${expression});`)();
    if (!Number.isFinite(value)) return null;
    return {
      expression,
      result: formatDecimal(value)
    };
  } catch {
    return null;
  }
}

function parseSimpleFraction(raw) {
  const match = normalizeText(raw).match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
  const decimal = numerator / denominator;
  return {
    numerator,
    denominator,
    decimal: formatDecimal(decimal)
  };
}

function detectType(message) {
  const text = normalizeText(message);
  const lower = text.toLowerCase();

  if (!text) return "empty";
  if (/^explain\b/.test(lower)) return "explain";
  if (/essay|paragraph|thesis|introduction|conclusion|outline/.test(lower)) return "essay";
  if (/^(-?\d+(\.\d+)?)\s*\/\s*(-?\d+(\.\d+)?)$/.test(text)) return "fraction";
  if (/[\d)]\s*(\+|-|\*|\/|×|÷)\s*[\d(]/.test(text) || /\bplus\b|\bminus\b|\btimes\b|\bdivided by\b/.test(lower)) return "math";
  if (/\bsolve\b|\bequation\b|\balgebra\b|\bx\b/.test(lower) && /\d/.test(lower)) return "math";
  if (text.split(/\s+/).length <= 3 && !/\?/.test(text) && !/\d/.test(text)) return "vague";
  if (/what is|define|how does|why does|photosynthesis|gravity|ecosystem|atom|cell|respiration/.test(lower)) return "concept";
  return "general";
}

function buildDirectMathReply(message) {
  const fraction = parseSimpleFraction(message);
  if (fraction) {
    return {
      reply: [
        `Direct answer: ${fraction.numerator} ÷ ${fraction.denominator} = ${fraction.decimal}.`,
        `Explanation: Divide the numerator by the denominator. ${fraction.numerator} divided by ${fraction.denominator} equals ${fraction.decimal}.`,
        "Example: 1/2 = 0.5 works the same way."
      ].join("\n\n"),
      assistantTag: "Math Help"
    };
  }

  const arithmetic = evaluateArithmetic(message);
  if (arithmetic) {
    return {
      reply: [
        `Direct answer: ${arithmetic.expression} = ${arithmetic.result}.`,
        `Explanation: Evaluate the expression using the order of operations, then simplify to get ${arithmetic.result}.`
      ].join("\n\n"),
      assistantTag: "Math Help"
    };
  }

  return null;
}

function buildFollowUpReply(message) {
  return {
    reply: `Direct answer: I need a little more context.\n\nExplanation: "${normalizeText(message)}" is too broad on its own. Tell me the exact problem, concept, or sentence you want help with, and I will walk through it clearly.`,
    assistantTag: "Clarification"
  };
}

function formatContextBlock(context = {}, attachmentNotes = []) {
  const parts = [];

  if (context.className) parts.push(`Class: ${context.className}`);
  if (context.assignmentTitle) parts.push(`Assignment: ${context.assignmentTitle}`);
  if (context.assignmentDescription) parts.push(`Assignment details: ${context.assignmentDescription}`);
  if (context.teacherNotes) parts.push(`Teacher notes: ${context.teacherNotes}`);
  if (Array.isArray(context.relevantChunks) && context.relevantChunks.length > 0) {
    parts.push(`Relevant class material:\n- ${context.relevantChunks.slice(0, 3).join("\n- ")}`);
  }
  if (Array.isArray(context.relevantVisualSummaries) && context.relevantVisualSummaries.length > 0) {
    parts.push(`Relevant visuals:\n- ${context.relevantVisualSummaries.slice(0, 2).join("\n- ")}`);
  }
  if (attachmentNotes.length > 0) {
    parts.push(`Attachment notes:\n- ${attachmentNotes.join("\n- ")}`);
  }

  return parts.length > 0 ? `Student context:\n${parts.join("\n")}` : "";
}

function formatHistory(history = []) {
  const recent = history
    .filter((item) => item?.role && item?.text)
    .slice(-6)
    .map((item) => `${item.role === "assistant" ? "Tutor" : "Student"}: ${String(item.text).trim()}`);

  return recent.length > 0 ? `Recent conversation:\n${recent.join("\n")}` : "";
}

function buildPrompt({ message, context, recentHistory, attachmentNotes }) {
  const type = detectType(message);
  const promptSections = [SYSTEM_PROMPT];

  if (type === "math" || type === "fraction") {
    promptSections.push("Question type guidance: This is a math question. Solve it step-by-step and keep the arithmetic accurate.");
  } else if (type === "explain" || type === "concept") {
    promptSections.push("Question type guidance: Teach the concept simply first, then add one clear example.");
  } else if (type === "essay") {
    promptSections.push("Question type guidance: Help with writing structure and clarity. Give concrete improvements, not a generic essay template.");
  } else {
    promptSections.push("Question type guidance: Answer directly, then explain briefly. Stay specific to the student's wording.");
  }

  const contextBlock = formatContextBlock(context, attachmentNotes);
  if (contextBlock) promptSections.push(contextBlock);

  const historyBlock = formatHistory(recentHistory);
  if (historyBlock) promptSections.push(historyBlock);

  promptSections.push(`Student question:\n${normalizeText(message)}`);
  promptSections.push("Keep the response under 220 words unless solving a multi-step problem.");

  return promptSections.filter(Boolean).join("\n\n");
}

async function askOllama(prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.2,
          top_p: 0.9,
          num_predict: 300
        }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with ${response.status}`);
    }

    const data = await response.json();
    return String(data.response ?? "").trim();
  } finally {
    clearTimeout(timeout);
  }
}

async function buildTutorReply(payload) {
  const message = normalizeText(payload.message);
  if (!message) {
    return {
      reply: "Direct answer: Please type a question first.\n\nExplanation: I can help with math, concepts, essays, and assignment questions once you give me the exact prompt.",
      assistantTag: "Clarification"
    };
  }

  const directMath = buildDirectMathReply(message);
  if (directMath) return directMath;

  if (detectType(message) === "vague") {
    return buildFollowUpReply(message);
  }

  const prompt = buildPrompt({
    message,
    context: payload.context ?? {},
    recentHistory: payload.recentHistory ?? [],
    attachmentNotes: payload.attachmentNotes ?? []
  });

  const reply = await askOllama(prompt);
  if (!reply) {
    throw new Error("Empty response from Ollama");
  }

  return {
    reply,
    assistantTag:
      detectType(message) === "essay" ? "Writing Help" :
      detectType(message) === "math" || detectType(message) === "fraction" ? "Math Help" :
      detectType(message) === "explain" || detectType(message) === "concept" ? "Concept Help" :
      "AI Tutor"
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === "POST" && req.url === "/api/chat") {
    try {
      const payload = await parseJsonBody(req);
      const result = await buildTutorReply(payload);
      sendJson(res, 200, result);
    } catch (error) {
      const message = String(error?.message ?? "");
      if (/fetch failed|ECONNREFUSED|abort|Ollama/i.test(message)) {
        sendJson(res, 503, {
          error: "AI is not running locally. Please start Ollama."
        });
        return;
      }

      sendJson(res, 500, {
        error: "The local tutor could not complete this request."
      });
    }
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`AI server running on http://localhost:${PORT}`);
  console.log(`Using Ollama model: ${MODEL}`);
});

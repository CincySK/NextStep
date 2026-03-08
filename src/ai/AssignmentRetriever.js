import { searchRelevantChunks } from "./VectorSearchService";

function detectQuestionRef(message) {
  const match = String(message ?? "").toLowerCase().match(/question\s*(\d+[a-z]?)/i)
    ?? String(message ?? "").toLowerCase().match(/\b(\d+[a-z])\b/);
  return match ? match[1] : null;
}

export function inferAssignmentReference(message, assignments, selectedAssignmentId, classId) {
  if (selectedAssignmentId) return selectedAssignmentId;
  const text = String(message ?? "").toLowerCase();
  const all = Object.values(assignments ?? {}).filter((item) =>
    classId ? item.classId === classId : true
  );
  const matched = all.find((assignment) => {
    if (text.includes(String(assignment.title ?? "").toLowerCase())) return true;
    const short = (assignment.title ?? "").split(" ").slice(0, 2).join(" ").toLowerCase();
    return short && text.includes(short);
  });
  return matched?.assignmentId ?? null;
}

function inferAssignmentByQuestionRef({ documents, classId, refs = [] }) {
  if (!refs.length) return null;
  const candidates = Object.values(documents ?? {}).filter((item) =>
    classId ? item.classId === classId : true
  );
  const scores = {};
  candidates.forEach((doc) => {
    const q = String(doc.questionNumber ?? "").toLowerCase();
    if (!q) return;
    if (!refs.includes(q)) return;
    scores[doc.assignmentId] = (scores[doc.assignmentId] ?? 0) + 1;
  });
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : null;
}

export function retrieveAssignmentContext({
  message,
  school,
  classId,
  selectedAssignmentId,
  attachmentQuestionRefs = []
}) {
  const questionRef = detectQuestionRef(message);
  const refs = Array.from(new Set([questionRef, ...attachmentQuestionRefs].filter(Boolean).map((item) => String(item).toLowerCase())));
  const inferredFromRef = inferAssignmentByQuestionRef({
    documents: school.documents,
    classId,
    refs
  });
  const assignmentId = inferAssignmentReference(
    message,
    school.assignments,
    selectedAssignmentId || inferredFromRef,
    classId
  );
  const assignment = assignmentId ? school.assignments?.[assignmentId] : null;
  let chunks = searchRelevantChunks({
    query: message,
    documents: school.documents,
    topK: 5,
    classId,
    assignmentId
  });

  if (refs.length > 0) {
    const targeted = chunks.filter((item) =>
      refs.includes(String(item.questionNumber ?? "").toLowerCase())
    );
    if (targeted.length > 0) chunks = targeted.concat(chunks).slice(0, 6);
  }

  return {
    assignment,
    chunks
  };
}

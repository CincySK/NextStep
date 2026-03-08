import { cosineSimilarity, createEmbedding } from "./EmbeddingService";

export function searchRelevantChunks({ query, documents, topK = 4, classId, assignmentId }) {
  const queryEmbedding = createEmbedding(query);
  const candidates = Object.values(documents ?? {}).filter((doc) => {
    if (assignmentId && doc.assignmentId !== assignmentId) return false;
    if (classId && doc.classId !== classId) return false;
    return true;
  });

  const scored = candidates.map((doc) => ({
    ...doc,
    score: cosineSimilarity(queryEmbedding, doc.embedding ?? [])
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}

export function chunkText(text, chunkSize = 120, overlap = 24) {
  const words = String(text ?? "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const chunks = [];

  let index = 0;
  while (index < words.length) {
    const slice = words.slice(index, index + chunkSize);
    chunks.push(slice.join(" "));
    if (index + chunkSize >= words.length) break;
    index += Math.max(1, chunkSize - overlap);
  }

  return chunks;
}

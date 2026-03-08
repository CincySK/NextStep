const conceptMap = {
  photosynthesis: {
    definition: "Photosynthesis is how plants make food using sunlight, water, and carbon dioxide.",
    example: "A green leaf uses sunlight to produce glucose (sugar) and releases oxygen.",
    application: "In class, this explains why plants are producers in food chains."
  },
  gravity: {
    definition: "Gravity is the force that pulls objects toward each other.",
    example: "When you drop a pen, Earth’s gravity pulls it downward.",
    application: "In school physics, gravity affects motion, weight, and falling objects."
  }
};

export function handleConceptExplanation(message) {
  const lower = String(message ?? "").toLowerCase();
  const key = Object.keys(conceptMap).find((item) => lower.includes(item));
  if (!key) {
    return {
      text: "Tell me the exact concept you want explained, and I will give a short definition plus an easy example."
    };
  }

  const concept = conceptMap[key];
  return {
    text: [
      `${key[0].toUpperCase()}${key.slice(1)}: ${concept.definition}`,
      `Example: ${concept.example}`,
      `How this appears in school: ${concept.application}`
    ].join("\n")
  };
}

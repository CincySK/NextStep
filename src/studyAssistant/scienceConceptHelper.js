const SCIENCE_CONCEPTS = {
  photosynthesis: {
    definition: "Photosynthesis is the process plants use to make food using sunlight.",
    explanation: "Plants absorb water from the soil and carbon dioxide from the air. Using light energy, they produce glucose (food) and oxygen.",
    example: "A leaf in sunlight uses chlorophyll to capture light and make sugar for the plant.",
    formula: "6CO2 + 6H2O + sunlight -> C6H12O6 + 6O2"
  },
  gravity: {
    definition: "Gravity is a force that pulls objects with mass toward each other.",
    explanation: "Earth's gravity pulls objects toward the ground, which is why things fall when dropped.",
    example: "If you drop a ball, gravity accelerates it downward.",
    formula: "Weight = mass × gravitational field strength"
  },
  ecosystems: {
    definition: "An ecosystem is a community of living things interacting with their environment.",
    explanation: "Plants, animals, microorganisms, water, air, and soil all affect one another in a system.",
    example: "A pond ecosystem includes fish, algae, insects, sunlight, and water chemistry."
  },
  ecosystem: {
    definition: "An ecosystem is a community of living things interacting with their environment.",
    explanation: "Plants, animals, microorganisms, water, air, and soil all affect one another in a system.",
    example: "A pond ecosystem includes fish, algae, insects, sunlight, and water chemistry."
  },
  atoms: {
    definition: "Atoms are the tiny building blocks of matter.",
    explanation: "Each atom has a nucleus (protons and neutrons) with electrons moving around it.",
    example: "Water is made from atoms: two hydrogen atoms and one oxygen atom."
  },
  atom: {
    definition: "An atom is the tiny building block of matter.",
    explanation: "Each atom has a nucleus (protons and neutrons) with electrons moving around it.",
    example: "Water is made from atoms: two hydrogen atoms and one oxygen atom."
  },
  energy: {
    definition: "Energy is the ability to do work or cause change.",
    explanation: "Energy can change forms, such as chemical energy in food becoming movement.",
    example: "A battery stores chemical energy that powers a flashlight."
  },
  evaporation: {
    definition: "Evaporation is when a liquid changes into a gas at the surface.",
    explanation: "As liquid particles gain energy, some escape into the air as vapor.",
    example: "A puddle gets smaller on a warm day because water evaporates."
  },
  cells: {
    definition: "Cells are the basic units of life.",
    explanation: "All living organisms are made of cells, which carry out essential functions.",
    example: "Muscle cells help your body move; nerve cells send signals."
  },
  cell: {
    definition: "A cell is the basic unit of life.",
    explanation: "All living organisms are made of cells, which carry out essential functions.",
    example: "Muscle cells help your body move; nerve cells send signals."
  },
  respiration: {
    definition: "Respiration is the process of releasing energy from food.",
    explanation: "Cells break down glucose, often using oxygen, to produce usable energy.",
    example: "During exercise, your cells increase respiration to supply more energy."
  },
  "food chains": {
    definition: "A food chain shows how energy moves from one organism to another.",
    explanation: "Energy usually flows from producers to consumers and then to decomposers.",
    example: "Grass -> rabbit -> fox is a simple food chain."
  },
  "food chain": {
    definition: "A food chain shows how energy moves from one organism to another.",
    explanation: "Energy usually flows from producers to consumers and then to decomposers.",
    example: "Grass -> rabbit -> fox is a simple food chain."
  },
  "water cycle": {
    definition: "The water cycle is the continuous movement of water through Earth systems.",
    explanation: "Water evaporates, condenses into clouds, then returns as precipitation.",
    example: "Rain fills rivers, then sunlight causes evaporation again."
  }
};

function detectConceptKey(message) {
  const lower = String(message ?? "").toLowerCase();
  return Object.keys(SCIENCE_CONCEPTS).find((key) => lower.includes(key)) ?? "";
}

export function explainScienceConcept(message) {
  const key = detectConceptKey(message);
  if (!key) {
    return {
      text: "Tell me the exact science concept (for example: photosynthesis, gravity, atoms, or water cycle), and I will explain it simply."
    };
  }

  const concept = SCIENCE_CONCEPTS[key];
  return {
    text: [
      "Definition:",
      concept.definition,
      "",
      "How it works:",
      concept.explanation,
      "",
      "Real-world example:",
      concept.example,
      ...(concept.formula ? ["", "Key formula/process:", concept.formula] : [])
    ].join("\n")
  };
}

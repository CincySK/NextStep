import { generateCareerSummary } from "../../services/aiCareerService";

function buildFallbackSynthesis(analysis, recommendations) {
  return {
    dominantThemes: analysis.dominantDomains.slice(0, 3).map((item) => item.domain),
    valueThemes: [analysis.constraints.salaryPriority === "high" ? "income focus" : "balanced priorities"],
    environmentThemes: analysis.dominantTraits.slice(0, 2).map((item) => item.domain),
    tradeoffs: [
      "Higher salary paths can involve longer training.",
      "Mission-driven roles can vary in compensation by region."
    ],
    narrative: `Your strongest theme is ${analysis.topDomain}. Your results emphasize roles that align with that direction and your stated priorities.`,
    careerExplanations: recommendations.map((career) => ({
      career: career.title,
      why: `This role matches your dominant themes (${analysis.topDomain}) and your preferred strengths/work style.`
    })),
    counselorQuestions: [
      "Which of these roles best matches my day-to-day preferences?",
      "What training path gives me both flexibility and momentum?",
      "Which courses or extracurriculars should I prioritize this year?"
    ]
  };
}

function buildResearchCard(career, explanation) {
  return {
    id: career.id,
    title: career.title,
    confidence: career.confidence,
    whyItFits: explanation,
    whatPeopleDo: career.dailyTasks,
    workEnvironment: career.environments.join(", "),
    salaryNote: career.salaryNote,
    outlookNote: career.outlookNote,
    educationPath: career.educationPath,
    relatedMajors: career.relatedMajors,
    firstStep: `Research one ${career.title} day-in-the-life video and write down three skills you notice.`
  };
}

export async function buildCareerResultsSummary({
  answerHistory,
  analysis,
  recommendations,
  excluded
}) {
  const fallbackSynthesis = buildFallbackSynthesis(analysis, recommendations);
  const summaryResult = await generateCareerSummary({
    fallbackSynthesis
  });
  const synthesis = summaryResult.data ?? fallbackSynthesis;

  const explanationLookup = Object.fromEntries(
    (synthesis.careerExplanations ?? []).map((item) => [item.career, item.why])
  );

  const researchCards = recommendations.map((career) =>
    buildResearchCard(career, explanationLookup[career.title] ?? `This role aligns with your dominant theme: ${analysis.topDomain}.`)
  );

  const comparePair = researchCards.length >= 2 ? [researchCards[0].id, researchCards[1].id] : [];

  return {
    title: "Your Career Exploration Report",
    generatedAt: new Date().toISOString(),
    topDomain: analysis.topDomain,
    dominantThemes: synthesis.dominantThemes ?? [],
    valueThemes: synthesis.valueThemes ?? [],
    environmentThemes: synthesis.environmentThemes ?? [],
    tradeoffs: synthesis.tradeoffs ?? [],
    narrative: synthesis.narrative,
    researchCards,
    comparePair,
    excludedRecommendations: excluded,
    counselorQuestions: synthesis.counselorQuestions ?? [],
    nextSteps: [
      "Choose 2 careers to compare and research deeply this week.",
      "Check education timelines and entry requirements for each path.",
      "Identify one class, club, or project you can start this month.",
      "Revisit this quiz in a few months as your interests evolve."
    ],
    aiSource: summaryResult.source ?? "rule-based"
  };
}

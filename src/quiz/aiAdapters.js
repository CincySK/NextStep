import { careerResults, collegeMatches } from "../data";

function getTopEntries(counter, topN = 2) {
  return Object.entries(counter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([key]) => key);
}

function normalizeText(items) {
  return items.map((item) => item.answer.toLowerCase()).join(" ");
}

export function generateNextCareerQuestion(answerHistory, context = {}) {
  // AI integration point:
  // Replace with LLM-driven next-question logic using answerHistory and availableQuestionIds.
  // For now, deterministic branching is primary and this fallback keeps flow stable.
  return context.ruleBasedNextQuestionId ?? null;
}

export function generateNextCollegeQuestion(answerHistory, context = {}) {
  // AI integration point:
  // Replace with model-generated follow-up selection from availableQuestionIds.
  return context.ruleBasedNextQuestionId ?? null;
}

export function generateRecommendationExplanation({ quizType, summary, answerHistory }) {
  // AI integration point:
  // This can be replaced by an LLM prompt that explains recommendation confidence and tradeoffs.
  const recentSignal = answerHistory.slice(-2).map((item) => item.answer).join(" and ");
  if (quizType === "career") {
    return `Your strongest signals point to ${summary.title}. Recent answers like ${recentSignal} reinforced this direction.`;
  }
  return `Your answers align with a ${summary.profileType} environment. Choices like ${recentSignal} helped shape this recommendation.`;
}

export function generateCareerSummary(answerHistory) {
  const tags = { Technology: 0, Healthcare: 0, Business: 0, Creative: 0, Communication: 0 };
  const answerTrace = normalizeText(answerHistory);

  answerHistory.forEach((item) => {
    const value = item.value;
    if (["stem", "build_products", "analyze_data", "deep_focus", "innovation", "product_team", "lab_team"].includes(value)) tags.Technology += 2;
    if (["service", "people_centered", "teaching", "community", "mission_org", "education_public"].includes(value)) tags.Healthcare += 2;
    if (["business", "entrepreneurship", "finance", "leadership", "execution", "startup", "consulting"].includes(value)) tags.Business += 2;
    if (["art", "visual_design", "storytelling", "creative", "creative_studio", "studio", "brand_team"].includes(value)) tags.Creative += 2;
    if (["humanities", "writing", "policy", "discussion", "research", "policy_org", "media_team"].includes(value)) tags.Communication += 2;
  });

  const topPaths = getTopEntries(tags, 2);
  const primaryPath = topPaths[0] ?? "Business";
  const fallbackMap = {
    Technology: careerResults.Technology,
    Healthcare: careerResults.Healthcare,
    Business: careerResults.Business,
    Creative: {
      title: "Creative & Experience Design Path",
      careers: ["UX Designer", "Brand Strategist", "Content Designer"],
      blurb: "Your answers show strong creative instincts plus practical decision-making."
    },
    Communication: {
      title: "Communication & Public Impact Path",
      careers: ["Policy Analyst", "Communications Specialist", "Teacher"],
      blurb: "You are motivated by communication, ideas, and helping people navigate complexity."
    }
  };

  const profile = fallbackMap[primaryPath];
  const majorMap = {
    Technology: ["Computer Science", "Information Systems", "Data Science"],
    Healthcare: ["Nursing", "Public Health", "Biology"],
    Business: ["Business Administration", "Finance", "Marketing"],
    Creative: ["Graphic Design", "Digital Media", "Interaction Design"],
    Communication: ["Communications", "Political Science", "Education"]
  };

  const whyMap = {
    Technology: "You consistently chose analytical and build-oriented options, which aligns with technology pathways.",
    Healthcare: "Your answers emphasize service, people impact, and support-oriented environments.",
    Business: "You favored leadership, outcomes, and strategy-focused decisions.",
    Creative: "You leaned toward creative expression, storytelling, and design-centered environments.",
    Communication: "You showed strong communication, writing, and policy-oriented interests."
  };

  return {
    title: profile.title,
    topMatches: profile.careers,
    whyItFits: `${profile.blurb} ${whyMap[primaryPath]}`,
    possibleMajors: majorMap[primaryPath],
    nextSteps: [
      `Interview one person working in ${profile.careers[0]}.`,
      `Compare two majors from your top pathway (${majorMap[primaryPath][0]} and ${majorMap[primaryPath][1]}).`,
      "Build a 30-day skill plan with one practical project."
    ],
    supportingSignals: topPaths,
    generatedAt: new Date().toISOString(),
    rawAnswerTrace: answerTrace
  };
}

export function generateCollegeSummary(answerHistory) {
  const signals = { Urban: 0, Balanced: 0, Classic: 0 };
  const lookup = Object.fromEntries(answerHistory.map((item) => [item.id, item.value]));

  if (lookup.college_size === "large") signals.Urban += 2;
  if (lookup.college_size === "medium") signals.Balanced += 2;
  if (lookup.college_size === "small") signals.Classic += 2;

  if (["career_outcomes", "location", "internships", "job_placement", "urban"].includes(lookup.college_priority) || ["internships", "job_placement", "urban"].includes(lookup.college_location_followup)) {
    signals.Urban += 1;
  }
  if (["support", "affordability", "advising", "wellness", "steady"].includes(lookup.college_priority) || ["advising", "wellness", "steady"].includes(lookup.college_final_fit)) {
    signals.Balanced += 1;
  }
  if (["small", "close_mentoring", "tight_community", "community"].includes(lookup.college_size) || ["community", "college_town"].includes(lookup.college_final_fit)) {
    signals.Classic += 1;
  }

  const profileType = getTopEntries(signals, 1)[0] ?? "Balanced";
  const samples = collegeMatches[profileType] ?? [];

  const fitReasonMap = {
    Urban: "You prioritized opportunity density, internships, and high-energy environments.",
    Balanced: "You balanced support systems, cost awareness, and practical outcomes.",
    Classic: "You preferred close community, mentoring, and a relationship-driven campus feel."
  };

  const topPriorityLabel = answerHistory.find((item) => item.id === "college_priority")?.answer ?? "overall fit";

  return {
    title: `${profileType} College Fit`,
    topMatches: samples.map((item) => item.name),
    whyItFits: `${fitReasonMap[profileType]} Your strongest stated priority was ${topPriorityLabel.toLowerCase()}.`,
    profileType,
    whatMattersMost: topPriorityLabel,
    sampleCollegeNotes: samples,
    nextSteps: [
      "Build a shortlist of 6-8 colleges matching this profile.",
      "Compare financial aid, support services, and internship access side-by-side.",
      "Book one info session and note how each school supports your top priority."
    ],
    generatedAt: new Date().toISOString()
  };
}

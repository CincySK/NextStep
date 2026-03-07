import { adjacentDomains, careerProfiles } from "../../data/careerProfiles";

const keywordMap = [
  { pattern: /\bhealth|patient|clinic|hospital|nurse|therapy|biology\b/i, domain: "healthcare", score: 2 },
  { pattern: /\bcode|software|tech|systems|engineer|cyber|data\b/i, domain: "technology", score: 2 },
  { pattern: /\bbusiness|finance|marketing|strategy|startup|operations\b/i, domain: "business", score: 2 },
  { pattern: /\bdesign|brand|visual|creative|story|media|ux\b/i, domain: "design", score: 2 },
  { pattern: /\bteach|education|mentor|student|school|counsel\b/i, domain: "education", score: 2 },
  { pattern: /\bcommunity|policy|public|impact|advocacy|social\b/i, domain: "public_impact", score: 2 }
];

function addToCounter(counter, key, amount) {
  counter[key] = (counter[key] ?? 0) + amount;
}

function normalizeTop(counter, topN = 4) {
  return Object.entries(counter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([domain, score]) => ({ domain, score }));
}

export function analyzeCareerAnswerHistory(answerHistory, questionCatalogById) {
  const domainScores = {};
  const traitScores = {};
  const constraints = {
    educationTolerance: "medium",
    salaryPriority: "balanced"
  };

  answerHistory.forEach((entry) => {
    const question = questionCatalogById[entry.id];
    if (!question) return;

    if (question.kind === "choice" && question.tags?.[entry.value]) {
      const tags = question.tags[entry.value];
      Object.entries(tags.domain ?? {}).forEach(([domain, score]) => addToCounter(domainScores, domain, score));
      Object.entries(tags.traits ?? {}).forEach(([trait, score]) => addToCounter(traitScores, trait, score));
      if (tags.constraints?.educationTolerance) constraints.educationTolerance = tags.constraints.educationTolerance;
      if (tags.constraints?.salaryPriority) constraints.salaryPriority = tags.constraints.salaryPriority;
    }

    if (question.kind === "text" && typeof entry.answer === "string") {
      keywordMap.forEach((rule) => {
        if (rule.pattern.test(entry.answer)) addToCounter(domainScores, rule.domain, rule.score);
      });
    }
  });

  const dominantDomains = normalizeTop(domainScores, 5);
  const dominantTraits = normalizeTop(traitScores, 5);
  const topDomain = dominantDomains[0]?.domain ?? "business";
  const secondDomain = dominantDomains[1]?.domain ?? null;
  const dominantDomainStrength = (dominantDomains[0]?.score ?? 0) - (dominantDomains[1]?.score ?? 0);

  return {
    domainScores,
    traitScores,
    dominantDomains,
    dominantTraits,
    constraints,
    topDomain,
    secondDomain,
    dominantDomainStrength
  };
}

function educationFit(profileEducation, tolerance) {
  const map = {
    short: { short: 1, medium: 0.85, medium_long: 0.65, long: 0.45 },
    medium: { short: 0.8, medium: 1, medium_long: 0.95, long: 0.7 },
    long: { short: 0.6, medium: 0.85, medium_long: 1, long: 1 }
  };
  return map[tolerance]?.[profileEducation] ?? 0.8;
}

function salaryFit(payBand, priority) {
  if (priority === "high") {
    if (payBand === "high") return 1;
    if (payBand === "medium_high") return 0.9;
    return 0.65;
  }
  if (priority === "mission") {
    if (payBand === "medium") return 1;
    if (payBand === "medium_high") return 0.9;
    return 0.8;
  }
  return 1;
}

export function scoreCareerMatches(analysis) {
  const ranked = careerProfiles.map((profile) => {
    let score = 0;

    profile.domains.forEach((domain) => {
      score += (analysis.domainScores[domain] ?? 0) * 3.2;
    });

    profile.traits.forEach((trait) => {
      score += (analysis.traitScores[trait] ?? 0) * 2;
    });

    score *= educationFit(profile.educationLevel, analysis.constraints.educationTolerance);
    score *= salaryFit(profile.payBand, analysis.constraints.salaryPriority);

    const confidence = Math.min(99, Math.max(35, Math.round(42 + score * 4)));
    return {
      ...profile,
      matchScore: Number(score.toFixed(2)),
      confidence
    };
  });

  return ranked.sort((a, b) => b.matchScore - a.matchScore);
}

export function validateCareerRecommendations(analysis, rankedCareers, limit = 4) {
  const topDomain = analysis.topDomain;
  const adjacent = adjacentDomains[topDomain] ?? [];
  const allowedDomains = new Set([topDomain, ...adjacent]);

  const filtered = [];
  const excluded = [];

  rankedCareers.forEach((career) => {
    const hasAllowedDomain = career.domains.some((domain) => allowedDomains.has(domain));

    if (analysis.dominantDomainStrength >= 4 && !hasAllowedDomain) {
      excluded.push({
        career: career.title,
        reason: `Lower alignment with your strongest theme (${topDomain}).`
      });
      return;
    }

    if (career.matchScore < 5.2) {
      excluded.push({
        career: career.title,
        reason: "Weak overall signal fit across your answers."
      });
      return;
    }

    filtered.push(career);
  });

  const recommendations = filtered.slice(0, limit);
  return { recommendations, excluded };
}

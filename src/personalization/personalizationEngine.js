const modeConfig = {
  "career-healthcare": {
    heroTitle: "You seem drawn to healthcare and helping others.",
    heroBody: "Keep exploring patient-care, diagnostics, and health-science pathways with clear next steps.",
    featuredModules: ["careerMatches", "healthcarePathways", "relatedMajors", "recommendedColleges"],
    nextActions: [
      "Compare two healthcare roles and list day-to-day differences.",
      "Review biology and health-science majors linked to your top matches.",
      "Try College Match next and filter for strong health pathways."
    ],
    accentMode: "career"
  },
  "career-tech": {
    heroTitle: "Your profile points to technical and systems-focused paths.",
    heroBody: "Build momentum with practical skill steps, major options, and career comparisons.",
    featuredModules: ["careerMatches", "stemPathways", "skillBuilder", "recommendedColleges"],
    nextActions: [
      "Pick one technical career and map required skills this semester.",
      "Compare CS, data, and engineering major pathways.",
      "Run College Match to find schools with strong STEM ecosystems."
    ],
    accentMode: "career"
  },
  "career-creative": {
    heroTitle: "You lean toward creative and communication-driven work.",
    heroBody: "Explore design, media, and storytelling paths while planning portfolio-friendly next steps.",
    featuredModules: ["careerMatches", "creativePathways", "portfolioSteps", "relatedMajors"],
    nextActions: [
      "Save two creative career options and compare responsibilities.",
      "Start a small portfolio project this month.",
      "Explore colleges with strong design or media programs."
    ],
    accentMode: "career"
  },
  "college-small-community": {
    heroTitle: "Let's find a college path with strong community and support.",
    heroBody: "Your profile values mentorship, belonging, and close learning environments.",
    featuredModules: ["collegeFit", "supportSystems", "schoolsToResearch", "admissionsPrep"],
    nextActions: [
      "Shortlist smaller campuses with strong advising culture.",
      "Compare student support services at your top schools.",
      "Run Career Quiz to connect majors and career direction."
    ],
    accentMode: "college"
  },
  "college-research-ambitious": {
    heroTitle: "Your fit leans toward high-opportunity college environments.",
    heroBody: "Focus on research access, internships, and outcomes-oriented campus ecosystems.",
    featuredModules: ["collegeFit", "researchOpportunities", "schoolsToResearch", "admissionsPrep"],
    nextActions: [
      "Compare internship pipelines at your top schools.",
      "Review outcomes and placement data by major.",
      "Run Career Quiz to narrow target majors."
    ],
    accentMode: "college"
  },
  "college-affordability": {
    heroTitle: "You are prioritizing strong-fit colleges with practical value.",
    heroBody: "Keep cost, scholarships, and return-on-investment front and center in your plan.",
    featuredModules: ["collegeFit", "affordabilityPlan", "schoolsToResearch", "admissionsPrep"],
    nextActions: [
      "Build a value-focused shortlist with in-state and aid options.",
      "List scholarship deadlines and required materials.",
      "Use Career Quiz to validate majors before committing."
    ],
    accentMode: "college"
  },
  "money-practical-beginner": {
    heroTitle: "Let's build money confidence one step at a time.",
    heroBody: "Your dashboard now emphasizes practical exercises and clear progress habits.",
    featuredModules: ["moneyExercises", "budgetConfidence", "savingsHabit", "futurePlanning"],
    nextActions: [
      "Complete one needs-vs-wants or spending challenge today.",
      "Set a simple weekly savings target and track consistency.",
      "Take Career or College Quiz next to connect goals with planning."
    ],
    accentMode: "money"
  },
  "money-goal-oriented": {
    heroTitle: "You're ready for goal-driven money planning.",
    heroBody: "Focus on structured savings, decision quality, and long-term planning habits.",
    featuredModules: ["moneyExercises", "goalTracking", "creditBasics", "futurePlanning"],
    nextActions: [
      "Choose one savings goal and set weekly milestones.",
      "Practice one scenario-based spending challenge this week.",
      "Use Career or College Quiz to align finances with your pathway."
    ],
    accentMode: "money"
  }
};

function detectCareerTheme(result) {
  const tokens = [
    result?.topDomain,
    ...(result?.dominantThemes ?? []),
    ...(result?.researchCards?.map((card) => card.title) ?? []),
    result?.narrative
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/health|nurs|medic|clinic|therapy|patient|public health/.test(tokens)) return "healthcare";
  if (/engineer|software|data|tech|cyber|ai|system/.test(tokens)) return "tech";
  if (/design|media|brand|creative|story|ux|content/.test(tokens)) return "creative";
  return "tech";
}

function detectCollegeTheme(result) {
  const profileType = (result?.profileType ?? "").toLowerCase();
  const priority = (result?.whatMattersMost ?? "").toLowerCase();
  const why = (result?.whyItFits ?? "").toLowerCase();
  const tokens = `${profileType} ${priority} ${why}`;

  if (/afford|scholar|cost|value|tuition/.test(tokens)) return "affordability";
  if (/small|community|mentor|support|close/.test(tokens)) return "small-community";
  return "research-ambitious";
}

function detectMoneyTheme(result) {
  const completed = Number(result?.completedActivities ?? 0);
  if (completed >= 3) return "goal-oriented";
  return "practical-beginner";
}

export function resolveDashboardMode({ primaryPath, result }) {
  if (primaryPath === "career") return `career-${detectCareerTheme(result)}`;
  if (primaryPath === "college") return `college-${detectCollegeTheme(result)}`;
  return `money-${detectMoneyTheme(result)}`;
}

export function resolveFeaturedModules(profile) {
  return modeConfig[profile.dashboardMode]?.featuredModules ?? [];
}

export function resolveHeroContent(profile) {
  const mode = modeConfig[profile.dashboardMode];
  return {
    title: mode?.heroTitle ?? "Welcome back to your personalized NextStep hub.",
    body: mode?.heroBody ?? "Your dashboard highlights your most relevant planning actions."
  };
}

export function resolveAccentMode(profile) {
  return modeConfig[profile.dashboardMode]?.accentMode ?? "default";
}

export function resolveSuggestedNextActions(profile) {
  return modeConfig[profile.dashboardMode]?.nextActions ?? [
    "Continue your next recommended module.",
    "Save one result card to your dashboard.",
    "Revisit your profile as your goals evolve."
  ];
}

function pickThemes(primaryPath, result) {
  if (primaryPath === "career") {
    return (result?.dominantThemes ?? [result?.topDomain]).filter(Boolean).slice(0, 4);
  }
  if (primaryPath === "college") {
    return [result?.profileType, result?.whatMattersMost].filter(Boolean);
  }
  return [result?.confidenceLevel, "financial confidence"].filter(Boolean);
}

export function buildUserProfileFromQuiz({ primaryPath, answers, result }) {
  const dashboardMode = resolveDashboardMode({ primaryPath, result });
  const base = {
    primaryPath,
    userThemes: pickThemes(primaryPath, result),
    dashboardMode,
    accentMode: "default",
    featuredModules: [],
    suggestedNextActions: [],
    firstQuiz: {
      type: primaryPath,
      answers,
      result,
      completedAt: new Date().toISOString()
    }
  };

  const profile = {
    ...base,
    featuredModules: resolveFeaturedModules(base),
    accentMode: resolveAccentMode(base),
    suggestedNextActions: resolveSuggestedNextActions(base)
  };

  return {
    ...profile,
    hero: resolveHeroContent(profile)
  };
}

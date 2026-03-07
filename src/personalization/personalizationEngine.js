const modeConfig = {
  "career-healthcare": {
    heroTitle: "You seem drawn to healthcare and helping others.",
    heroBody: "Your plan now prioritizes people-centered health pathways, related majors, and college options to compare.",
    homeHighlights: [
      { title: "Healthcare Career Focus", body: "Patient care, diagnostics, therapy, and public health roles aligned to your profile." },
      { title: "Major Pathways", body: "Biology, nursing, and health science tracks connected to your top signals." },
      { title: "College Next Step", body: "Run College Match with health-focused filters to build a smarter shortlist." }
    ],
    featuredModules: ["careerMatches", "healthcarePathways", "relatedMajors", "recommendedColleges"],
    quickLinks: ["/career", "/college", "/dashboard"],
    nextActions: [
      "Compare two healthcare roles and list daily-task differences.",
      "Review one health-science major requirement sheet.",
      "Add 3 colleges with strong healthcare pathways to your shortlist."
    ],
    accentMode: "career",
    modeLabel: "Career-First: Healthcare"
  },
  "career-tech": {
    heroTitle: "Your profile points to technical and systems-focused paths.",
    heroBody: "NextStep now emphasizes technical roles, skill-building, and STEM-aligned college exploration.",
    homeHighlights: [
      { title: "Technical Career Matches", body: "Software, data, and engineering direction based on your strongest answer patterns." },
      { title: "Skills To Build", body: "Practical next skills to improve readiness for technical pathways." },
      { title: "STEM College Alignment", body: "Prioritize colleges with strong project, internship, and lab ecosystems." }
    ],
    featuredModules: ["careerMatches", "stemPathways", "skillBuilder", "recommendedColleges"],
    quickLinks: ["/career", "/college", "/dashboard"],
    nextActions: [
      "Pick one technical role and map required skills this semester.",
      "Compare two STEM majors tied to your top career signals.",
      "Run College Match and prioritize research/internship opportunities."
    ],
    accentMode: "career",
    modeLabel: "Career-First: Technology"
  },
  "career-creative": {
    heroTitle: "You lean toward creative and communication-driven work.",
    heroBody: "Your dashboard is tuned for creative pathways, portfolio progression, and related majors to explore.",
    homeHighlights: [
      { title: "Creative Career Paths", body: "Design, media, and storytelling options connected to your responses." },
      { title: "Portfolio Momentum", body: "Small projects that help you build proof of skill over time." },
      { title: "Major + College Fit", body: "Programs that support communication, design, and creative production." }
    ],
    featuredModules: ["careerMatches", "creativePathways", "portfolioSteps", "relatedMajors"],
    quickLinks: ["/career", "/college", "/dashboard"],
    nextActions: [
      "Save two creative roles and compare responsibilities.",
      "Start one portfolio project this month.",
      "Explore colleges with strong design or media programs."
    ],
    accentMode: "career",
    modeLabel: "Career-First: Creative"
  },
  "college-small-community": {
    heroTitle: "Let's find a college path with strong community and support.",
    heroBody: "Your experience now prioritizes mentoring, fit, and high-support campuses for your next research steps.",
    homeHighlights: [
      { title: "Community-Fit Schools", body: "Smaller or relationship-driven environments aligned to your preferences." },
      { title: "Support Systems", body: "Advising, mentorship, and first-year resources to compare directly." },
      { title: "Admissions Clarity", body: "Practical prep steps to improve readiness for your target schools." }
    ],
    featuredModules: ["collegeFit", "supportSystems", "schoolsToResearch", "admissionsPrep"],
    quickLinks: ["/college", "/career", "/dashboard"],
    nextActions: [
      "Shortlist community-focused campuses with strong advising.",
      "Compare support services across your top 3 schools.",
      "Use Career Quiz to connect college options to career direction."
    ],
    accentMode: "college",
    modeLabel: "College-First: Community Fit"
  },
  "college-research-ambitious": {
    heroTitle: "Your fit leans toward high-opportunity college environments.",
    heroBody: "You will now see more research, internship, and outcomes-focused guidance throughout the platform.",
    homeHighlights: [
      { title: "Research + Opportunity Focus", body: "Schools with stronger labs, project-based learning, and professional pipelines." },
      { title: "Outcomes Lens", body: "Internship access and post-grad outcomes prioritized in your decision process." },
      { title: "Major Direction", body: "Career-linked major exploration to sharpen your school shortlist." }
    ],
    featuredModules: ["collegeFit", "researchOpportunities", "schoolsToResearch", "admissionsPrep"],
    quickLinks: ["/college", "/career", "/dashboard"],
    nextActions: [
      "Compare internship pipelines for your top schools.",
      "Review outcomes by major before final shortlisting.",
      "Take Career Quiz to clarify long-term direction."
    ],
    accentMode: "college",
    modeLabel: "College-First: Research + Outcomes"
  },
  "college-affordability": {
    heroTitle: "You're focused on strong-fit colleges with practical value.",
    heroBody: "Your dashboard now emphasizes affordability planning, scholarships, and value-focused school research.",
    homeHighlights: [
      { title: "Value-Fit Colleges", body: "In-state and cost-conscious options matched to your priorities." },
      { title: "Aid + Scholarship Plan", body: "Keep deadlines and aid strategy visible while you research." },
      { title: "Major ROI Alignment", body: "Connect major choice with affordability and outcomes." }
    ],
    featuredModules: ["collegeFit", "affordabilityPlan", "schoolsToResearch", "admissionsPrep"],
    quickLinks: ["/college", "/money", "/dashboard"],
    nextActions: [
      "Build a value-focused college shortlist.",
      "Track scholarship deadlines and required documents.",
      "Use Money Skills to strengthen budget confidence for college planning."
    ],
    accentMode: "college",
    modeLabel: "College-First: Affordability"
  },
  "money-practical-beginner": {
    heroTitle: "Let's build money confidence one step at a time.",
    heroBody: "Your layout now prioritizes practical exercises, habit building, and everyday decision confidence.",
    homeHighlights: [
      { title: "Action-First Money Practice", body: "Short exercises to improve day-to-day financial decisions." },
      { title: "Budgeting Confidence", body: "Guided choices instead of spreadsheet-style budgeting." },
      { title: "Future Planning Link", body: "Connect money habits with your career and college goals." }
    ],
    featuredModules: ["moneyExercises", "budgetConfidence", "savingsHabit", "futurePlanning"],
    quickLinks: ["/money", "/career", "/dashboard"],
    nextActions: [
      "Complete one spending or needs-vs-wants activity today.",
      "Set a weekly savings amount and track it for 2 weeks.",
      "Take Career or College Quiz to link goals with financial decisions."
    ],
    accentMode: "money",
    modeLabel: "Money-First: Practical Builder"
  },
  "money-goal-oriented": {
    heroTitle: "You're building goal-driven money habits.",
    heroBody: "Your dashboard now emphasizes savings targets, progress tracking, and stronger planning decisions.",
    homeHighlights: [
      { title: "Goal Tracking Focus", body: "Turn money goals into weekly milestones and visible progress." },
      { title: "Credit + Planning Basics", body: "Strengthen core habits that support long-term stability." },
      { title: "Future Path Alignment", body: "Connect financial choices to college and career next steps." }
    ],
    featuredModules: ["moneyExercises", "goalTracking", "creditBasics", "futurePlanning"],
    quickLinks: ["/money", "/college", "/dashboard"],
    nextActions: [
      "Set one savings target and review progress weekly.",
      "Complete a credit-basics check to reinforce good habits.",
      "Take College or Career Quiz to align plans with your budget goals."
    ],
    accentMode: "money",
    modeLabel: "Money-First: Goal Oriented"
  }
};

function detectCareerTheme(result) {
  const tokens = [
    result?.topDomain,
    ...(result?.dominantThemes ?? []),
    ...(result?.researchCards?.map((card) => card.title) ?? []),
    result?.narrative
  ].filter(Boolean).join(" ").toLowerCase();

  if (/health|nurs|medic|clinic|therapy|patient|public health/.test(tokens)) return "healthcare";
  if (/design|media|brand|creative|story|ux|content/.test(tokens)) return "creative";
  if (/engineer|software|data|tech|cyber|ai|system/.test(tokens)) return "tech";
  return "tech";
}

function detectCollegeTheme(result) {
  const tokens = `${(result?.profileType ?? "").toLowerCase()} ${(result?.whatMattersMost ?? "").toLowerCase()} ${(result?.whyItFits ?? "").toLowerCase()}`;
  if (/afford|scholar|cost|value|tuition/.test(tokens)) return "affordability";
  if (/small|community|mentor|support|close/.test(tokens)) return "small-community";
  return "research-ambitious";
}

function detectMoneyTheme(result) {
  const completed = Number(result?.completedActivities ?? 0);
  return completed >= 3 ? "goal-oriented" : "practical-beginner";
}

export function resolveDashboardMode({ primaryPath, result }) {
  if (primaryPath === "career") return `career-${detectCareerTheme(result)}`;
  if (primaryPath === "college") return `college-${detectCollegeTheme(result)}`;
  return `money-${detectMoneyTheme(result)}`;
}

function getModeData(profile) {
  return modeConfig[profile.dashboardMode] ?? null;
}

export function resolveFeaturedModules(profile) {
  return getModeData(profile)?.featuredModules ?? [];
}

export function resolveHeroContent(profile) {
  const mode = getModeData(profile);
  return {
    title: mode?.heroTitle ?? "Welcome back to your personalized NextStep hub.",
    body: mode?.heroBody ?? "Your dashboard highlights your most relevant planning actions."
  };
}

export function resolveAccentMode(profile) {
  return getModeData(profile)?.accentMode ?? "default";
}

export function resolveSuggestedNextActions(profile) {
  return getModeData(profile)?.nextActions ?? [
    "Continue your next recommended module.",
    "Save one result card to your dashboard.",
    "Revisit your profile as your goals evolve."
  ];
}

export function resolveHomeHighlights(profile) {
  return getModeData(profile)?.homeHighlights ?? [];
}

export function resolveQuickLinks(profile) {
  return getModeData(profile)?.quickLinks ?? ["/career", "/college", "/money"];
}

export function resolveModeLabel(profile) {
  return getModeData(profile)?.modeLabel ?? "Personalized Mode";
}

function toReadablePath(path) {
  if (path === "career") return "Career Quiz";
  if (path === "college") return "College Match Quiz";
  return "Money Skills";
}

function buildPersonalizationReason(primaryPath, userThemes) {
  const themeSnippet = (userThemes ?? []).slice(0, 2).join(" and ");
  if (themeSnippet) {
    return `Because you started with ${toReadablePath(primaryPath)} and showed strong signals around ${themeSnippet}, this plan prioritizes your most relevant next steps.`;
  }
  return `Because you started with ${toReadablePath(primaryPath)}, this plan prioritizes your most relevant next steps first.`;
}

function pickThemes(primaryPath, result) {
  if (primaryPath === "career") return (result?.dominantThemes ?? [result?.topDomain]).filter(Boolean).slice(0, 4);
  if (primaryPath === "college") return [result?.profileType, result?.whatMattersMost].filter(Boolean);
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
    homeHighlights: [],
    quickLinks: [],
    modeLabel: "Personalized Mode",
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
    suggestedNextActions: resolveSuggestedNextActions(base),
    homeHighlights: resolveHomeHighlights(base),
    quickLinks: resolveQuickLinks(base),
    modeLabel: resolveModeLabel(base),
    reasonWhy: buildPersonalizationReason(primaryPath, base.userThemes),
    priorityHeadline: `Best next focus: ${resolveModeLabel(base)}`
  };

  return {
    ...profile,
    hero: resolveHeroContent(profile)
  };
}

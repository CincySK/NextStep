export const careerBaseQuestions = [
  {
    id: "interest_area",
    stage: "understand",
    kind: "choice",
    title: "Which area sounds most interesting right now?",
    helper: "Pick the direction you want to explore first.",
    options: [
      { value: "healthcare", label: "Healthcare and wellness" },
      { value: "technology", label: "Technology and systems" },
      { value: "business", label: "Business and strategy" },
      { value: "design", label: "Design and storytelling" },
      { value: "education", label: "Teaching and student support" },
      { value: "public_impact", label: "Public service and social impact" }
    ],
    tags: {
      healthcare: { domain: { healthcare: 4, people_helping: 1 } },
      technology: { domain: { technology: 4, systems: 2 } },
      business: { domain: { business: 4, leadership: 1 } },
      design: { domain: { design: 4, communication: 2 } },
      education: { domain: { education: 4, people_helping: 2 } },
      public_impact: { domain: { public_impact: 4, people_helping: 1 } }
    }
  },
  {
    id: "favorite_subject",
    stage: "understand",
    kind: "choice",
    title: "Which school subject do you usually enjoy most?",
    options: [
      { value: "biology", label: "Biology / health science" },
      { value: "math_cs", label: "Math / computer science" },
      { value: "econ_business", label: "Economics / business" },
      { value: "english_history", label: "English / history" },
      { value: "art_media", label: "Art / media / design" }
    ],
    tags: {
      biology: { domain: { healthcare: 3, public_impact: 1 } },
      math_cs: { domain: { technology: 3, data: 2 } },
      econ_business: { domain: { business: 3, finance: 2 } },
      english_history: { domain: { communication: 2, public_impact: 2, education: 1 } },
      art_media: { domain: { design: 3, communication: 2 } }
    }
  },
  {
    id: "strength_style",
    stage: "understand",
    kind: "choice",
    title: "What feels most like your strength?",
    options: [
      { value: "help_people", label: "Helping people directly" },
      { value: "solve_systems", label: "Solving technical/system problems" },
      { value: "create_ideas", label: "Creating ideas and experiences" },
      { value: "analyze_numbers", label: "Analyzing data and numbers" },
      { value: "lead_projects", label: "Leading projects and teams" }
    ],
    tags: {
      help_people: { traits: { people: 3, service: 2 }, domain: { people_helping: 2, healthcare: 1, education: 1 } },
      solve_systems: { traits: { analysis: 2, problem_solving: 2 }, domain: { technology: 3, systems: 2 } },
      create_ideas: { traits: { creative: 3, storytelling: 2 }, domain: { design: 2, communication: 2 } },
      analyze_numbers: { traits: { analysis: 3, structured: 1 }, domain: { data: 3, business: 1, finance: 2 } },
      lead_projects: { traits: { leadership: 3, execution: 2 }, domain: { business: 2, leadership: 2 } }
    }
  },
  {
    id: "work_preference",
    stage: "understand",
    kind: "choice",
    title: "What type of daily work do you prefer?",
    options: [
      { value: "people_facing", label: "Mostly people-facing and collaborative" },
      { value: "mixed", label: "A balanced mix of people and focused work" },
      { value: "deep_focus", label: "Mostly focused, independent work" },
      { value: "hands_on", label: "Hands-on practical work" }
    ],
    tags: {
      people_facing: { traits: { people: 2, communication: 2 } },
      mixed: { traits: { balanced: 2 } },
      deep_focus: { traits: { analysis: 2, structured: 1 } },
      hands_on: { traits: { hands_on: 3 } }
    }
  },
  {
    id: "impact_goal",
    stage: "understand",
    kind: "choice",
    title: "What kind of impact matters most to you?",
    options: [
      { value: "health_impact", label: "Improving health and quality of life" },
      { value: "innovation", label: "Building new tools or systems" },
      { value: "financial_growth", label: "Driving growth and business results" },
      { value: "creative_influence", label: "Shaping ideas, brands, or stories" },
      { value: "community_change", label: "Creating social or community impact" }
    ],
    tags: {
      health_impact: { domain: { healthcare: 3, people_helping: 2 } },
      innovation: { domain: { technology: 3, systems: 1 } },
      financial_growth: { domain: { business: 3, finance: 2 } },
      creative_influence: { domain: { design: 3, communication: 2 } },
      community_change: { domain: { public_impact: 3, education: 1, people_helping: 2 } }
    }
  },
  {
    id: "education_tolerance",
    stage: "understand",
    kind: "choice",
    title: "How much training or education are you open to?",
    options: [
      { value: "short_path", label: "Short path (certification or 2-year route)" },
      { value: "bachelor_path", label: "Bachelor's degree path" },
      { value: "advanced_path", label: "Open to graduate/professional training" }
    ],
    tags: {
      short_path: { constraints: { educationTolerance: "short" } },
      bachelor_path: { constraints: { educationTolerance: "medium" } },
      advanced_path: { constraints: { educationTolerance: "long" } }
    }
  },
  {
    id: "salary_priority",
    stage: "understand",
    kind: "choice",
    title: "How important is salary right now in your decision?",
    options: [
      { value: "high", label: "Very important" },
      { value: "balanced", label: "Important, but balanced with meaning" },
      { value: "mission", label: "Meaning and impact matter most" }
    ],
    tags: {
      high: { constraints: { salaryPriority: "high" } },
      balanced: { constraints: { salaryPriority: "balanced" } },
      mission: { constraints: { salaryPriority: "mission" }, domain: { public_impact: 1, people_helping: 1 } }
    }
  },
  {
    id: "career_notes",
    stage: "understand",
    kind: "text",
    title: "Anything else you want in your future career?",
    helper: "Optional: mention lifestyle needs, values, or careers you are curious about.",
    placeholder: "Example: I want stable income, meaningful work, and room to grow."
  }
];

export function getDefaultCareerFollowUp(analysis) {
  const topDomain = analysis.dominantDomains?.[0]?.domain ?? "business";

  const followUps = {
    healthcare: {
      id: "followup_healthcare_path",
      stage: "adaptive",
      kind: "choice",
      title: "In healthcare, which path feels most interesting?",
      helper: "This helps narrow your fit inside healthcare.",
      options: [
        { value: "patient_care", label: "Direct patient care" },
        { value: "diagnostics", label: "Diagnostics and analysis" },
        { value: "public_health", label: "Public health and prevention" },
        { value: "health_admin", label: "Healthcare operations or administration" },
        { value: "health_tech", label: "Health technology and systems" }
      ]
    },
    technology: {
      id: "followup_technology_path",
      stage: "adaptive",
      kind: "choice",
      title: "Within technology, what type of work sounds best?",
      options: [
        { value: "software_build", label: "Building software products" },
        { value: "data_insights", label: "Data analysis and insights" },
        { value: "security", label: "Cybersecurity and risk" },
        { value: "product_collab", label: "Cross-functional product work" }
      ]
    },
    business: {
      id: "followup_business_path",
      stage: "adaptive",
      kind: "choice",
      title: "In business, where do you see yourself most?",
      options: [
        { value: "entrepreneurship", label: "Entrepreneurship and building ideas" },
        { value: "finance_strategy", label: "Finance and strategic analysis" },
        { value: "marketing_growth", label: "Marketing and growth" },
        { value: "operations", label: "Operations and execution" }
      ]
    },
    design: {
      id: "followup_design_path",
      stage: "adaptive",
      kind: "choice",
      title: "In design, which direction feels strongest?",
      options: [
        { value: "visual_brand", label: "Visual design and branding" },
        { value: "ux_product", label: "UX and product design" },
        { value: "content_story", label: "Content and storytelling" },
        { value: "research_comm", label: "User research and communication" }
      ]
    },
    education: {
      id: "followup_education_path",
      stage: "adaptive",
      kind: "choice",
      title: "In education/support, where do you want to contribute?",
      options: [
        { value: "classroom_teaching", label: "Classroom teaching" },
        { value: "student_counseling", label: "Counseling and student support" },
        { value: "program_design", label: "Education program design" },
        { value: "community_learning", label: "Community and outreach learning" }
      ]
    },
    public_impact: {
      id: "followup_public_impact_path",
      stage: "adaptive",
      kind: "choice",
      title: "For public impact work, what feels most meaningful?",
      options: [
        { value: "policy", label: "Policy and advocacy" },
        { value: "community_programs", label: "Community programs and support" },
        { value: "research_analysis", label: "Research and analysis" },
        { value: "communications", label: "Public communication and awareness" }
      ]
    }
  };

  return followUps[topDomain] ?? followUps.business;
}

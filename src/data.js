export const careerQuiz = [
  {
    prompt: "Which activity sounds most exciting?",
    options: [
      { label: "Designing apps", tag: "Technology" },
      { label: "Helping patients", tag: "Healthcare" },
      { label: "Starting a business", tag: "Business" }
    ]
  },
  {
    prompt: "What school subject do you enjoy most?",
    options: [
      { label: "Computer Science", tag: "Technology" },
      { label: "Biology", tag: "Healthcare" },
      { label: "Economics", tag: "Business" }
    ]
  },
  {
    prompt: "How do you like solving problems?",
    options: [
      { label: "Build tools", tag: "Technology" },
      { label: "Support people", tag: "Healthcare" },
      { label: "Plan strategy", tag: "Business" }
    ]
  }
];

export const careerResults = {
  Technology: {
    title: "Technology Path",
    careers: ["Software Developer", "UX Designer", "Data Analyst"],
    blurb: "You enjoy creating systems and solving technical challenges in digital spaces."
  },
  Healthcare: {
    title: "Healthcare Path",
    careers: ["Registered Nurse", "Physical Therapist", "Public Health Educator"],
    blurb: "You are people-focused and motivated by impact, service, and care."
  },
  Business: {
    title: "Business Path",
    careers: ["Marketing Manager", "Financial Analyst", "Entrepreneur"],
    blurb: "You think strategically and enjoy leadership, growth, and decision-making."
  }
};

export const collegeQuiz = [
  {
    prompt: "Preferred campus vibe?",
    options: [
      { label: "Urban and fast-paced", type: "Urban" },
      { label: "Medium-sized collaborative", type: "Balanced" },
      { label: "Traditional campus town", type: "Classic" }
    ]
  },
  {
    prompt: "Class environment?",
    options: [
      { label: "Small seminars", type: "Classic" },
      { label: "Mix of lecture + workshop", type: "Balanced" },
      { label: "Large research university", type: "Urban" }
    ]
  },
  {
    prompt: "Top priority?",
    options: [
      { label: "Internships and industry links", type: "Urban" },
      { label: "Strong support and mentorship", type: "Balanced" },
      { label: "Campus life and traditions", type: "Classic" }
    ]
  }
];

export const collegeMatches = {
  Urban: [
    { name: "Northeastern University", reason: "Excellent co-op and city internship access." },
    { name: "University of Southern California", reason: "Strong industry pipelines and broad majors." },
    { name: "New York University", reason: "Career-focused learning in a global city." }
  ],
  Balanced: [
    { name: "University of Florida", reason: "Large opportunities with strong student support." },
    { name: "University of Wisconsin-Madison", reason: "Collaborative academics and campus resources." },
    { name: "Virginia Tech", reason: "Hands-on learning with strong advising culture." }
  ],
  Classic: [
    { name: "University of Virginia", reason: "Strong traditions and liberal arts depth." },
    { name: "Wake Forest University", reason: "Smaller classes and close faculty connections." },
    { name: "Davidson College", reason: "High mentoring and community-centered campus life." }
  ]
};

export const collegeLookFor = [
  "Strong GPA trend in core classes",
  "Clear extracurricular commitment",
  "Leadership or initiative",
  "Compelling personal statement",
  "Teacher recommendations",
  "Evidence of resilience and growth"
];

export const budgetDefaults = {
  monthlyIncome: 1200,
  expenses: [
    { name: "Food", value: 250 },
    { name: "Transport", value: 120 },
    { name: "Phone", value: 60 },
    { name: "Entertainment", value: 150 },
    { name: "Savings", value: 200 }
  ]
};
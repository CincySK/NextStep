export const careerQuestionBank = {
  startId: "career_subject",
  estimatedSteps: 5,
  questions: {
    career_subject: {
      id: "career_subject",
      title: "To start, which class do you usually enjoy the most?",
      helper: "Go with your instinct.",
      options: [
        { value: "stem", label: "Math or science" },
        { value: "humanities", label: "English or history" },
        { value: "art", label: "Art, media, or design" },
        { value: "business", label: "Business or economics" }
      ],
      next: (answers) => {
        const map = {
          stem: "career_stem_focus",
          humanities: "career_humanities_focus",
          art: "career_art_focus",
          business: "career_business_focus"
        };
        return map[answers.career_subject] ?? null;
      }
    },
    career_stem_focus: {
      id: "career_stem_focus",
      title: "When you work on STEM tasks, what feels most rewarding?",
      options: [
        { value: "build_products", label: "Building tools or products people use" },
        { value: "analyze_data", label: "Analyzing data to find patterns" },
        { value: "research", label: "Testing ideas and running experiments" }
      ],
      next: () => "career_stem_style"
    },
    career_humanities_focus: {
      id: "career_humanities_focus",
      title: "What type of humanities work feels most natural to you?",
      options: [
        { value: "writing", label: "Writing and clear communication" },
        { value: "teaching", label: "Teaching or mentoring others" },
        { value: "policy", label: "Law, policy, or civic impact" }
      ],
      next: () => "career_humanities_style"
    },
    career_art_focus: {
      id: "career_art_focus",
      title: "What creative work do you enjoy most?",
      options: [
        { value: "visual_design", label: "Visual design and branding" },
        { value: "storytelling", label: "Storytelling and media" },
        { value: "digital_experience", label: "Designing digital experiences" }
      ],
      next: () => "career_art_style"
    },
    career_business_focus: {
      id: "career_business_focus",
      title: "Which business challenge sounds most exciting?",
      options: [
        { value: "entrepreneurship", label: "Launching ideas and leading projects" },
        { value: "finance", label: "Managing money and making decisions from numbers" },
        { value: "marketing", label: "Growing products and understanding audiences" }
      ],
      next: () => "career_business_style"
    },
    career_stem_style: {
      id: "career_stem_style",
      title: "How do you like to solve technical problems?",
      options: [
        { value: "deep_focus", label: "Deep focus, then present the solution" },
        { value: "team_projects", label: "Collaborate with a team from day one" },
        { value: "hands_on_testing", label: "Prototype and test quickly" }
      ],
      next: () => "career_impact"
    },
    career_humanities_style: {
      id: "career_humanities_style",
      title: "How do you like to work through ideas?",
      options: [
        { value: "discussion", label: "Debate and discussion" },
        { value: "research", label: "Independent research and writing" },
        { value: "community", label: "Community-facing work" }
      ],
      next: () => "career_impact"
    },
    career_art_style: {
      id: "career_art_style",
      title: "How do your best ideas usually come together?",
      options: [
        { value: "visual", label: "Sketching visual concepts" },
        { value: "content", label: "Crafting stories and messages" },
        { value: "interactive", label: "Designing interactive experiences" }
      ],
      next: () => "career_impact"
    },
    career_business_style: {
      id: "career_business_style",
      title: "What kind of business work style fits you best?",
      options: [
        { value: "leadership", label: "Lead teams and make decisions" },
        { value: "analysis", label: "Analyze performance and strategy" },
        { value: "execution", label: "Drive projects from plan to launch" }
      ],
      next: () => "career_impact"
    },
    career_impact: {
      id: "career_impact",
      title: "What kind of impact do you want your work to have?",
      helper: "This helps personalize your final recommendations.",
      options: [
        { value: "innovation", label: "Build new solutions and innovation" },
        { value: "service", label: "Help people directly" },
        { value: "leadership", label: "Lead teams and organizations" },
        { value: "creative", label: "Create stories, brands, and experiences" }
      ],
      next: (answers) => {
        const subject = answers.career_subject;
        if (subject === "stem") return "career_environment_stem";
        if (subject === "humanities") return "career_environment_humanities";
        if (subject === "art") return "career_environment_art";
        if (subject === "business") return "career_environment_business";
        return null;
      }
    },
    career_environment_stem: {
      id: "career_environment_stem",
      title: "Which STEM environment would keep you most motivated?",
      options: [
        { value: "lab_team", label: "Research lab or technical team" },
        { value: "product_team", label: "Product or engineering squad" },
        { value: "mission_org", label: "Mission-driven science or health org" }
      ],
      next: () => null
    },
    career_environment_humanities: {
      id: "career_environment_humanities",
      title: "Where would you most like to apply your communication strengths?",
      options: [
        { value: "education_public", label: "Education or public-service institutions" },
        { value: "policy_org", label: "Policy, legal, or advocacy settings" },
        { value: "media_team", label: "Media or communications teams" }
      ],
      next: () => null
    },
    career_environment_art: {
      id: "career_environment_art",
      title: "What creative environment fits your energy best?",
      options: [
        { value: "studio", label: "Design or creative studio" },
        { value: "brand_team", label: "In-house brand or content team" },
        { value: "digital_product", label: "Digital product and UX team" }
      ],
      next: () => null
    },
    career_environment_business: {
      id: "career_environment_business",
      title: "Which business setting sounds most exciting long-term?",
      options: [
        { value: "startup", label: "Startup environment" },
        { value: "enterprise", label: "Large organization with clear paths" },
        { value: "consulting", label: "Client-facing strategy or consulting" }
      ],
      next: () => null
    }
  }
};

export const collegeQuestionBank = {
  startId: "college_size",
  estimatedSteps: 5,
  questions: {
    college_size: {
      id: "college_size",
      title: "Let’s start simple: what campus size feels right to you?",
      helper: "There is no perfect answer. Pick what feels most natural.",
      options: [
        { value: "small", label: "Small campus" },
        { value: "medium", label: "Medium campus" },
        { value: "large", label: "Large campus" }
      ],
      next: (answers) => {
        const map = {
          small: "college_small_followup",
          medium: "college_medium_followup",
          large: "college_large_followup"
        };
        return map[answers.college_size] ?? null;
      }
    },
    college_small_followup: {
      id: "college_small_followup",
      title: "In a smaller school, what matters most to you?",
      options: [
        { value: "close_mentoring", label: "Close mentoring from faculty" },
        { value: "tight_community", label: "Tight community feel" },
        { value: "discussion_classes", label: "Small discussion-based classes" }
      ],
      next: () => "college_priority"
    },
    college_medium_followup: {
      id: "college_medium_followup",
      title: "In a medium campus, what are you hoping to get?",
      options: [
        { value: "balance", label: "Balanced academics and campus life" },
        { value: "club_life", label: "Strong student org and club options" },
        { value: "flexibility", label: "Flexibility to explore majors" }
      ],
      next: () => "college_priority"
    },
    college_large_followup: {
      id: "college_large_followup",
      title: "For a larger school, what excites you most?",
      options: [
        { value: "research", label: "Research opportunities and labs" },
        { value: "diversity", label: "Broad, diverse student community" },
        { value: "campus_energy", label: "High-energy campus environment" }
      ],
      next: () => "college_priority"
    },
    college_priority: {
      id: "college_priority",
      title: "Which priority is most important in your college decision?",
      options: [
        { value: "affordability", label: "Affordability and scholarship potential" },
        { value: "career_outcomes", label: "Internships and career outcomes" },
        { value: "support", label: "Student support and advising" },
        { value: "location", label: "Location and lifestyle fit" }
      ],
      next: (answers) => {
        const map = {
          affordability: "college_affordability_followup",
          career_outcomes: "college_career_followup",
          support: "college_support_followup",
          location: "college_location_followup"
        };
        return map[answers.college_priority] ?? null;
      }
    },
    college_affordability_followup: {
      id: "college_affordability_followup",
      title: "What affordability path feels most realistic right now?",
      options: [
        { value: "in_state", label: "In-state and lower tuition options" },
        { value: "aid_heavy", label: "Targeting strong aid packages" },
        { value: "work_study", label: "Work-study and flexible earning options" }
      ],
      next: () => "college_final_fit"
    },
    college_career_followup: {
      id: "college_career_followup",
      title: "Which career support would help you most?",
      options: [
        { value: "internships", label: "Internship access during school" },
        { value: "alumni_network", label: "Strong alumni network and mentorship" },
        { value: "job_placement", label: "Clear placement and outcomes data" }
      ],
      next: () => "college_final_fit"
    },
    college_support_followup: {
      id: "college_support_followup",
      title: "What support system matters most for your success?",
      options: [
        { value: "advising", label: "Academic advising and mentorship" },
        { value: "wellness", label: "Mental health and wellness support" },
        { value: "first_year", label: "Strong first-year transition programs" }
      ],
      next: () => "college_final_fit"
    },
    college_location_followup: {
      id: "college_location_followup",
      title: "What location setting matches your lifestyle?",
      options: [
        { value: "urban", label: "Urban and connected to city opportunities" },
        { value: "suburban", label: "Suburban and balanced pace" },
        { value: "college_town", label: "Traditional college town" }
      ],
      next: () => "college_final_fit"
    },
    college_final_fit: {
      id: "college_final_fit",
      title: "Final check: where do you think you'll thrive most day-to-day?",
      options: [
        { value: "high_energy", label: "Fast-paced, opportunity-rich environment" },
        { value: "steady", label: "Steady balance of support and challenge" },
        { value: "community", label: "Community-focused and relationship-driven" }
      ],
      next: () => null
    }
  }
};

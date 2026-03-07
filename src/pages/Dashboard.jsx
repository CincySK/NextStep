import { useMemo, useState } from "react";
import ProgressBadge from "../components/ProgressBadge";
import { loadPersonalizationProfile } from "../personalization/personalizationStorage";
import { loadAppData, updateAppData } from "../storage";
import { loadOnboardingData } from "../onboarding/onboardingStorage";

function getOnboardingSuggestions(profile) {
  if (!profile) return [];
  if (profile.primaryPath && (!profile.helpAreas || profile.helpAreas.length === 0)) {
    if (profile.primaryPath === "career") return ["Continue with career matches, major exploration, and related college research."];
    if (profile.primaryPath === "college") return ["Keep refining your college fit profile and shortlist schools to research."];
    return ["Build money confidence through short practical exercises and weekly goals."];
  }
  const suggestions = [];
  const helpSet = new Set(profile.helpAreas ?? []);

  if (helpSet.has("all") || helpSet.has("careers")) suggestions.push("Try the Career Path quiz and save two roles to compare.");
  if (helpSet.has("all") || helpSet.has("colleges")) suggestions.push("Complete College Match and shortlist 3 schools to research.");
  if (helpSet.has("all") || helpSet.has("money")) suggestions.push("Finish one Money Skills activity and track your progress.");
  if (profile.learningGoals === "majors") suggestions.push("Use your career results to compare majors tied to top matches.");
  if ((profile.interests ?? []).length > 0) {
    suggestions.push(`Explore career paths connected to: ${(profile.interests ?? []).slice(0, 3).join(", ")}.`);
  }

  return suggestions.slice(0, 4);
}

export default function Dashboard({ onRestartOnboarding }) {
  const [data, setData] = useState(loadAppData());
  const profile = loadPersonalizationProfile();
  const onboardingProfile = loadOnboardingData();
  const suggestions = useMemo(() => getOnboardingSuggestions(onboardingProfile), [onboardingProfile]);

  const completedCount = useMemo(
    () => Object.values(data.progress).filter(Boolean).length,
    [data.progress]
  );

  function removeFavorite(item) {
    const next = updateAppData((current) => ({
      ...current,
      favorites: current.favorites.filter((f) => !(f.type === item.type && f.name === item.name))
    }));
    setData(next);
  }

  function formatTimestamp(value) {
    if (!value) return "Not available";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "Not available" : parsed.toLocaleString();
  }

  const moduleBlocks = {
    careerMatches: {
      id: "careerMatches",
      title: "Your Career Matches",
      body: data.quizResults?.career
        ? data.quizResults.career.narrative ?? data.quizResults.career.whyItFits
        : "Take the Career Quiz to unlock your strongest role matches."
    },
    healthcarePathways: {
      id: "healthcarePathways",
      title: "Healthcare Pathways To Explore",
      body: "Compare patient care, diagnostics, public health, and health-science tracks for fit."
    },
    stemPathways: {
      id: "stemPathways",
      title: "Technical Pathways",
      body: "Explore software, data, and engineering paths with practical skill next steps."
    },
    creativePathways: {
      id: "creativePathways",
      title: "Creative Pathways",
      body: "Review design, media, and storytelling careers and start building portfolio signals."
    },
    portfolioSteps: {
      id: "portfolioSteps",
      title: "Portfolio Builder",
      body: "Choose one small project to demonstrate your skills this month."
    },
    relatedMajors: {
      id: "relatedMajors",
      title: "Majors To Explore",
      body: data.quizResults?.career?.researchCards?.[0]?.relatedMajors?.join(", ") ?? "Complete Career Quiz to unlock major recommendations."
    },
    recommendedColleges: {
      id: "recommendedColleges",
      title: "Related Colleges",
      body: "Run College Match to find campuses aligned with your pathway."
    },
    collegeFit: {
      id: "collegeFit",
      title: "Your College Fit Profile",
      body: data.quizResults?.college?.whyItFits ?? "Complete College Match to generate your fit profile."
    },
    supportSystems: {
      id: "supportSystems",
      title: "Support Systems",
      body: "Compare advising, mentoring, and first-year support across your shortlist."
    },
    schoolsToResearch: {
      id: "schoolsToResearch",
      title: "Schools To Research",
      body: data.quizResults?.college?.topMatches?.slice(0, 3).join(", ") ?? "Save 3 colleges to begin a focused comparison."
    },
    admissionsPrep: {
      id: "admissionsPrep",
      title: "Admissions Prep",
      body: "Track GPA trends, activity impact, and application milestones."
    },
    researchOpportunities: {
      id: "researchOpportunities",
      title: "Research + Internship Focus",
      body: "Prioritize schools with strong labs, internship access, and outcomes data."
    },
    affordabilityPlan: {
      id: "affordabilityPlan",
      title: "Affordability Planner",
      body: "Track in-state options, scholarships, aid deadlines, and value-fit schools."
    },
    moneyExercises: {
      id: "moneyExercises",
      title: "Next Money Exercise",
      body: "Complete one guided money challenge to keep building confidence."
    },
    budgetConfidence: {
      id: "budgetConfidence",
      title: "Budget Confidence",
      body: "Practice scenario-based decisions that balance needs, wants, and savings."
    },
    savingsHabit: {
      id: "savingsHabit",
      title: "Savings Habit",
      body: "Set one small weekly target and track consistency."
    },
    goalTracking: {
      id: "goalTracking",
      title: "Goal Tracking",
      body: "Turn savings goals into measurable weekly milestones."
    },
    creditBasics: {
      id: "creditBasics",
      title: "Credit Basics",
      body: "Use quick checks to reinforce strong early credit habits."
    },
    futurePlanning: {
      id: "futurePlanning",
      title: "Future Planning Basics",
      body: "Connect money decisions to your college and career goals."
    },
    skillBuilder: {
      id: "skillBuilder",
      title: "Skill Builder",
      body: "Choose one new skill aligned with your top pathway this month."
    }
  };

  const featuredModuleCards = (profile?.featuredModules ?? [])
    .map((id) => moduleBlocks[id])
    .filter(Boolean)
    .slice(0, 4);

  return (
    <section className={`section-card module-card dash-accent-${profile?.accentMode ?? "default"}`}>
      <div className="section-header">
        <div>
          <h2>{profile?.hero?.title ?? "Learning Hub"}</h2>
          <p className="intro-copy">{profile?.hero?.body ?? "Track your module progress and keep the options you want to revisit."}</p>
        </div>
        <div className="badge-row">
          <ProgressBadge label="Completed" value={`${completedCount}/3`} />
          <ProgressBadge label="Favorites" value={data.favorites.length} />
        </div>
      </div>

      <div className="cta-row">
        <button className="secondary-btn" onClick={onRestartOnboarding}>
          Restart Onboarding
        </button>
      </div>

      {suggestions.length > 0 && (
        <section className="result-card">
          <h3>Personalized Suggestions</h3>
          <ul className="list-clean">
            {suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {featuredModuleCards.length > 0 && (
        <section className="result-card">
          <h3>Featured For You</h3>
          <div className="dashboard-grid">
            {featuredModuleCards.map((item) => (
              <article key={item.id} className="mini-card">
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {profile?.suggestedNextActions?.length > 0 && (
        <section className="result-card">
          <h3>Suggested Next Actions</h3>
          <ul className="list-clean">
            {profile.suggestedNextActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="dashboard-grid">
        <article className="mini-card">
          <h3>Module Progress</h3>
          <ul className="list-clean">
            <li>Career Path: {data.progress.careerComplete ? "Done" : "Pending"}</li>
            <li>College Match: {data.progress.collegeComplete ? "Done" : "Pending"}</li>
            <li>Money Skills: {data.progress.moneyComplete ? "Done" : "Pending"}</li>
          </ul>
        </article>

        <article className="mini-card">
          <h3>Latest Outcomes</h3>
          <ul className="list-clean">
            <li>Career: {data.scores.career ?? "-"}</li>
            <li>College: {data.scores.college ?? "-"}</li>
            <li>Money: {data.scores.money ?? "-"}</li>
          </ul>
        </article>

        <article className="mini-card">
          <h3>Saved Ideas</h3>
          {data.favorites.length === 0 ? (
            <p>No saved items yet. Add careers or colleges from your module results.</p>
          ) : (
            <ul className="list-clean">
              {data.favorites.map((fav) => (
                <li key={`${fav.type}-${fav.name}`} className="favorite-item">
                  <span>{fav.name} <small>({fav.type})</small></span>
                  <button className="mini-action" onClick={() => removeFavorite(fav)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      {(data.quizResults?.career || data.quizResults?.college) && (
        <div className="dashboard-grid">
          {data.quizResults?.career && (
            <article className="mini-card">
              <h3>Career Quiz Snapshot</h3>
              <p>{data.quizResults.career.narrative ?? data.quizResults.career.whyItFits}</p>
              <p className="mini-label">Updated: {formatTimestamp(data.quizResults.career.completedAt)}</p>
            </article>
          )}
          {data.quizResults?.college && (
            <article className="mini-card">
              <h3>College Quiz Snapshot</h3>
              <p>{data.quizResults.college.whyItFits}</p>
              <p className="mini-label">Updated: {formatTimestamp(data.quizResults.college.completedAt)}</p>
            </article>
          )}
        </div>
      )}

      {data.quizResults?.careerHistory?.length > 0 && (
        <section className="result-card">
          <h3>Career Exploration History</h3>
          <ul className="list-clean">
            {data.quizResults.careerHistory.map((item) => (
              <li key={item.createdAt}>
                {formatTimestamp(item.createdAt)}: Top themes around <strong>{item.topDomain}</strong> with paths like {item.topCareerTitles.slice(0, 2).join(", ")}.
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}

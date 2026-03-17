import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBadge from "../components/ProgressBadge";
import { finalizeFirstQuizPersonalization } from "../personalization/profileLifecycle";
import { loadPersonalizationProfile } from "../personalization/personalizationStorage";
import { updateAppData } from "../storage";

const sortingItems = [
  { label: "Rent", type: "need" },
  { label: "Textbooks", type: "need" },
  { label: "Streaming subscription", type: "want" },
  { label: "Groceries", type: "need" },
  { label: "New game release", type: "want" }
];

const lessonRoadmap = [
  {
    id: "spending",
    title: "Spending priorities",
    description: "Learn how to balance needs, wants, and savings without losing sight of real-life tradeoffs.",
    outcome: "Choose healthier weekly spending plans."
  },
  {
    id: "sorting",
    title: "Needs vs wants",
    description: "Practice distinguishing essentials from optional expenses so your budget decisions stay grounded.",
    outcome: "Sort everyday costs with more confidence."
  },
  {
    id: "savings",
    title: "Savings planning",
    description: "Turn a goal into a weekly plan and test whether your current habits can realistically support it.",
    outcome: "Set practical savings targets and timelines."
  },
  {
    id: "credit",
    title: "Credit basics",
    description: "Build early credit habits that support long-term stability instead of creating avoidable problems.",
    outcome: "Recognize behaviors that strengthen credit health."
  }
];

export default function MoneySkills() {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState("spending");
  const [spendingChoice, setSpendingChoice] = useState("");
  const [spendingFeedback, setSpendingFeedback] = useState("");

  const [sortingAnswers, setSortingAnswers] = useState({});
  const [sortingFeedback, setSortingFeedback] = useState("");

  const [goalAmount, setGoalAmount] = useState(600);
  const [goalWeeks, setGoalWeeks] = useState(12);
  const [weeklySave, setWeeklySave] = useState(40);
  const [savingsFeedback, setSavingsFeedback] = useState("");

  const [creditChoice, setCreditChoice] = useState("");
  const [creditFeedback, setCreditFeedback] = useState("");

  const completed = useMemo(
    () => ({
      spending: Boolean(spendingFeedback),
      sorting: Boolean(sortingFeedback),
      savings: Boolean(savingsFeedback),
      credit: Boolean(creditFeedback)
    }),
    [creditFeedback, savingsFeedback, sortingFeedback, spendingFeedback]
  );

  const completedCount = Object.values(completed).filter(Boolean).length;
  const profile = loadPersonalizationProfile();
  const completionPercent = Math.round((completedCount / lessonRoadmap.length) * 100);
  const confidenceLevel = completedCount >= 3 ? "Growing confident" : completedCount >= 1 ? "Building foundation" : "Just getting started";

  const assessmentCards = useMemo(
    () => [
      {
        label: "Current stage",
        value: confidenceLevel,
        detail: completedCount >= 3 ? "You are applying money habits across multiple skill areas." : "Start with one strong decision and build from there."
      },
      {
        label: "Milestones cleared",
        value: `${completedCount}/${lessonRoadmap.length}`,
        detail: "Each activity you complete updates your saved progress automatically."
      },
      {
        label: "Next target",
        value: completedCount >= 3 ? "Dashboard unlocked" : lessonRoadmap.find((item) => !completed[item.id])?.title ?? "Review progress",
        detail: completedCount >= 3 ? "You have enough evidence to personalize your next dashboard steps." : "Finish the next open lesson to keep momentum moving."
      }
    ],
    [completed, completedCount, confidenceLevel]
  );

  useEffect(() => {
    const completedActivities = Object.entries(completed)
      .filter(([, done]) => done)
      .map(([key]) => key);
    const moneyResult = {
      title: "Money Skills Progress",
      completedActivities: completedCount,
      confidenceLevel: completedCount >= 3 ? "growing_confident" : "building_foundation",
      focusAreas: completedActivities,
      whyItFits: completedCount >= 3
        ? "You are building reliable habits across spending, saving, and credit basics."
        : "You are building foundational confidence with practical money decisions."
    };

    updateAppData((current) => ({
      ...current,
      progress: { ...current.progress, moneyComplete: completedCount >= 3 },
      scores: { ...current.scores, money: `${completedCount}/4 activities complete` },
      quizResults: {
        ...current.quizResults,
        money: {
          ...moneyResult,
          completedAt: new Date().toISOString()
        }
      }
    }));

    if (completedCount >= 3) {
      finalizeFirstQuizPersonalization({
        quizType: "money",
        answers: {
          spendingChoice,
          sortingAnswers,
          goalAmount,
          goalWeeks,
          weeklySave,
          creditChoice
        },
        result: moneyResult
      });
    }
  }, [
    completed,
    completedCount,
    creditChoice,
    goalAmount,
    goalWeeks,
    sortingAnswers,
    spendingChoice,
    weeklySave
  ]);

  function checkSpending(choice) {
    setSpendingChoice(choice);
    if (choice === "option-b") {
      setSpendingFeedback("Strong choice. You covered needs first, added savings, and kept one fun expense in balance.");
      return;
    }
    setSpendingFeedback("Good try. Rebalance by covering essentials first, then savings, then optional spending.");
  }

  function updateSorting(label, value) {
    setSortingAnswers((prev) => ({ ...prev, [label]: value }));
  }

  function checkSorting() {
    let correct = 0;
    sortingItems.forEach((item) => {
      if (sortingAnswers[item.label] === item.type) correct += 1;
    });
    if (correct === sortingItems.length) {
      setSortingFeedback("Excellent. You correctly sorted every item and prioritized core needs.");
      return;
    }
    setSortingFeedback(`You got ${correct}/${sortingItems.length}. Focus on separating essentials from optional extras.`);
  }

  function checkSavingsGoal() {
    const neededPerWeek = Math.ceil(goalAmount / goalWeeks);
    if (weeklySave >= neededPerWeek) {
      setSavingsFeedback(`Great plan. You need about $${neededPerWeek}/week and your current plan meets that goal.`);
      return;
    }
    setSavingsFeedback(`You need about $${neededPerWeek}/week. Try increasing weekly savings by $${neededPerWeek - weeklySave}.`);
  }

  function checkCredit(choice) {
    setCreditChoice(choice);
    if (choice === "option-c") {
      setCreditFeedback("Correct. Paying on time and keeping balances low supports a healthy credit history.");
      return;
    }
    setCreditFeedback("Not quite. Strong credit habits usually include on-time payments and low credit utilization.");
  }

  return (
    <section className="module-page-shell money-course-shell">
      <header className="module-hero module-hero-money money-course-hero">
        <div className="module-hero-copy">
          <p className="quest-kicker">Money skills course</p>
          <h1>Build financial confidence through a structured beginner pathway.</h1>
          <p className="quest-lead">
            This is not a single feature. It is a short learning sequence that introduces budgeting judgment, savings planning,
            and credit fundamentals through guided practice and immediate feedback.
          </p>
          <div className="badge-row">
            <ProgressBadge label="Course Progress" value={`${completedCount}/4 lessons`} />
            <ProgressBadge label="Completion" value={`${completionPercent}%`} />
            <ProgressBadge label="Confidence" value={confidenceLevel} />
          </div>
          <div className="cta-row">
            <button className="primary-btn" onClick={() => setActiveCard(lessonRoadmap.find((item) => !completed[item.id])?.id ?? "spending")}>
              Continue course
            </button>
            <button className="secondary-btn" onClick={() => navigate("/dashboard")}>
              View dashboard impact
            </button>
          </div>
        </div>

        <aside className="module-side-card money-side-card">
          <p className="quest-side-kicker">First-time assessment</p>
          <div className="money-assessment-stack">
            {assessmentCards.map((card) => (
              <article key={card.label} className="money-assessment-card">
                <span className="money-assessment-label">{card.label}</span>
                <strong>{card.value}</strong>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </aside>
      </header>

      <section className="quest-panel money-course-panel">
        <div className="panel-head">
          <div>
            <p className="quest-kicker">Course path</p>
            <h2>Four lessons, one practical foundation</h2>
          </div>
        </div>

        <div className="money-roadmap">
          {lessonRoadmap.map((lesson, index) => {
            const isDone = completed[lesson.id];
            const isActive = activeCard === lesson.id;
            return (
              <button
                key={lesson.id}
                className={`money-roadmap-step ${isDone ? "money-roadmap-step-complete" : ""} ${isActive ? "money-roadmap-step-active" : ""}`}
                onClick={() => setActiveCard(lesson.id)}
              >
                <span className="money-roadmap-index">{index + 1}</span>
                <div className="money-roadmap-copy">
                  <div className="money-roadmap-top">
                    <h3>{lesson.title}</h3>
                    <span className={`status-chip ${isDone ? "status-complete" : isActive ? "status-active" : "status-recommended"}`}>
                      {isDone ? "Completed" : isActive ? "Current lesson" : "Up next"}
                    </span>
                  </div>
                  <p>{lesson.description}</p>
                  <small>{lesson.outcome}</small>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="quest-grid-two money-course-grid">
        <section className="quest-panel money-practice-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Practice lab</p>
              <h2>Interactive lesson board</h2>
            </div>
          </div>

          <div className="exercise-grid">
            <article className="exercise-card">
              <button className="exercise-head" onClick={() => setActiveCard("spending")}>
                <h3>Spending Choices Challenge</h3>
                <span>{activeCard === "spending" ? "Open" : "Start"}</span>
              </button>
              {activeCard === "spending" && (
                <div className="exercise-body">
                  <p>You have $300 this week. Which plan is strongest?</p>
                  <div className="option-grid">
                    <button className={`option-btn ${spendingChoice === "option-a" ? "option-selected" : ""}`} onClick={() => checkSpending("option-a")}>
                      $220 wants, $80 needs, $0 savings
                    </button>
                    <button className={`option-btn ${spendingChoice === "option-b" ? "option-selected" : ""}`} onClick={() => checkSpending("option-b")}>
                      $170 needs, $60 savings, $70 wants
                    </button>
                    <button className={`option-btn ${spendingChoice === "option-c" ? "option-selected" : ""}`} onClick={() => checkSpending("option-c")}>
                      $120 needs, $30 savings, $150 wants
                    </button>
                  </div>
                  {spendingFeedback && <p className="feedback">{spendingFeedback}</p>}
                </div>
              )}
            </article>

            <article className="exercise-card">
              <button className="exercise-head" onClick={() => setActiveCard("sorting")}>
                <h3>Needs vs Wants Sort</h3>
                <span>{activeCard === "sorting" ? "Open" : "Start"}</span>
              </button>
              {activeCard === "sorting" && (
                <div className="exercise-body">
                  <p>Sort each item as a need or a want.</p>
                  <div className="sorting-grid">
                    {sortingItems.map((item) => (
                      <div key={item.label} className="sorting-row">
                        <span>{item.label}</span>
                        <div className="dual-actions">
                          <button
                            className={`option-btn compact ${sortingAnswers[item.label] === "need" ? "option-selected" : ""}`}
                            onClick={() => updateSorting(item.label, "need")}
                          >
                            Need
                          </button>
                          <button
                            className={`option-btn compact ${sortingAnswers[item.label] === "want" ? "option-selected" : ""}`}
                            onClick={() => updateSorting(item.label, "want")}
                          >
                            Want
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="primary-btn" onClick={checkSorting}>Check My Sorting</button>
                  {sortingFeedback && <p className="feedback">{sortingFeedback}</p>}
                </div>
              )}
            </article>

            <article className="exercise-card">
              <button className="exercise-head" onClick={() => setActiveCard("savings")}>
                <h3>Savings Goal Planner</h3>
                <span>{activeCard === "savings" ? "Open" : "Start"}</span>
              </button>
              {activeCard === "savings" && (
                <div className="exercise-body">
                  <p>Create a simple savings plan and check if your weekly amount is enough.</p>
                  <div className="budget-grid">
                    <label className="field">
                      Savings goal amount
                      <input type="number" min="1" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} />
                    </label>
                    <label className="field">
                      Weeks to reach goal
                      <input type="number" min="1" value={goalWeeks} onChange={(e) => setGoalWeeks(Number(e.target.value))} />
                    </label>
                    <label className="field">
                      Planned weekly savings
                      <input type="number" min="0" value={weeklySave} onChange={(e) => setWeeklySave(Number(e.target.value))} />
                    </label>
                  </div>
                  <button className="primary-btn" onClick={checkSavingsGoal}>Check My Plan</button>
                  {savingsFeedback && <p className="feedback">{savingsFeedback}</p>}
                </div>
              )}
            </article>

            <article className="exercise-card">
              <button className="exercise-head" onClick={() => setActiveCard("credit")}>
                <h3>Credit Basics Quick Check</h3>
                <span>{activeCard === "credit" ? "Open" : "Start"}</span>
              </button>
              {activeCard === "credit" && (
                <div className="exercise-body">
                  <p>Which habit usually helps a student build stronger credit?</p>
                  <div className="option-grid">
                    <button className={`option-btn ${creditChoice === "option-a" ? "option-selected" : ""}`} onClick={() => checkCredit("option-a")}>
                      Missing due dates but paying large amounts sometimes
                    </button>
                    <button className={`option-btn ${creditChoice === "option-b" ? "option-selected" : ""}`} onClick={() => checkCredit("option-b")}>
                      Maxing out cards each month
                    </button>
                    <button className={`option-btn ${creditChoice === "option-c" ? "option-selected" : ""}`} onClick={() => checkCredit("option-c")}>
                      Paying on time and keeping balances low
                    </button>
                  </div>
                  {creditFeedback && <p className="feedback">{creditFeedback}</p>}
                </div>
              )}
            </article>
          </div>
        </section>

        <section className="quest-panel money-milestone-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Milestones</p>
              <h2>What good progress looks like</h2>
            </div>
          </div>

          <div className="money-milestone-stack">
            <article className={`money-milestone-card ${completedCount >= 1 ? "money-milestone-card-complete" : ""}`}>
              <h3>Foundation built</h3>
              <p>Complete your first lesson to start turning abstract money ideas into practical choices.</p>
            </article>
            <article className={`money-milestone-card ${completedCount >= 2 ? "money-milestone-card-complete" : ""}`}>
              <h3>Decision habits forming</h3>
              <p>By lesson two, you should be separating essentials, wants, and realistic tradeoffs with more confidence.</p>
            </article>
            <article className={`money-milestone-card ${completedCount >= 3 ? "money-milestone-card-complete" : ""}`}>
              <h3>Personalization unlocked</h3>
              <p>Three completed lessons give NextStep enough evidence to tailor your dashboard and recommendations.</p>
            </article>
            <article className={`money-milestone-card ${completedCount === 4 ? "money-milestone-card-complete" : ""}`}>
              <h3>Course complete</h3>
              <p>Finish all four lessons to leave with a well-rounded beginner foundation in spending, savings, and credit.</p>
            </article>
          </div>
        </section>
      </div>

      {completedCount >= 3 && (
        <section className="quest-panel money-outcome-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Outcome</p>
              <h2>Your dashboard is ready to adapt</h2>
            </div>
          </div>
          <p>
            You completed enough lessons to unlock a money-first personalized experience with tailored next steps and stronger recommendations.
          </p>
          <div className="cta-row">
            <button className="primary-btn" onClick={() => navigate("/dashboard")}>
              {profile?.primaryPath === "money" ? "Open my personalized dashboard" : "Go to dashboard"}
            </button>
          </div>
        </section>
      )}
    </section>
  );
}

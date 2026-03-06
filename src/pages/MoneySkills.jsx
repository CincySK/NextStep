import { useEffect, useMemo, useState } from "react";
import ProgressBadge from "../components/ProgressBadge";
import { updateAppData } from "../storage";

const sortingItems = [
  { label: "Rent", type: "need" },
  { label: "Textbooks", type: "need" },
  { label: "Streaming subscription", type: "want" },
  { label: "Groceries", type: "need" },
  { label: "New game release", type: "want" }
];

export default function MoneySkills() {
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

  useEffect(() => {
    updateAppData((current) => ({
      ...current,
      progress: { ...current.progress, moneyComplete: completedCount >= 3 },
      scores: { ...current.scores, money: `${completedCount}/4 activities complete` }
    }));
  }, [completedCount]);

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
    <section className="section-card module-card">
      <div className="section-header">
        <div>
          <h2>Money Skills Module</h2>
          <p className="intro-copy">
            Learn the basics through short activities designed for beginners. Each activity gives feedback so you can
            improve your next decision.
          </p>
        </div>
        <div className="badge-row">
          <ProgressBadge label="Activities Complete" value={`${completedCount}/4`} />
          <ProgressBadge label="Module Status" value={completedCount >= 3 ? "Complete" : "In Progress"} />
        </div>
      </div>

      <section className="lesson-note">
        <h3>Why this matters</h3>
        <p>Financial literacy helps you avoid stress, build confidence, and make smart choices in college and early career life.</p>
      </section>

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

      <section className="lesson-note">
        <h3>Learning tip</h3>
        <p>Small weekly habits beat perfect plans. Start simple, review often, and improve one decision at a time.</p>
      </section>
    </section>
  );
}

import { useMemo, useState } from "react";
import ProgressBadge from "../components/ProgressBadge";
import { budgetDefaults } from "../data";
import { loadAppData, updateAppData } from "../storage";

export default function MoneySkills() {
  const existing = loadAppData().budget;

  const [monthlyIncome, setMonthlyIncome] = useState(existing?.monthlyIncome ?? budgetDefaults.monthlyIncome);
  const [expenses, setExpenses] = useState(existing?.expenses ?? budgetDefaults.expenses);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.value || 0), 0),
    [expenses]
  );

  const remaining = monthlyIncome - totalExpenses;

  function updateExpense(index, value) {
    setExpenses((prev) => prev.map((item, idx) => (idx === index ? { ...item, value: Number(value) } : item)));
  }

  function saveBudget() {
    updateAppData((current) => ({
      ...current,
      progress: { ...current.progress, moneyComplete: true },
      scores: { ...current.scores, money: remaining >= 0 ? "On Track" : "Over Budget" },
      budget: { monthlyIncome, expenses }
    }));
  }

  return (
    <section className="section-card money-theme">
      <div className="section-header">
        <h2>Money Skills Budget Simulator</h2>
        <div className="badge-row">
          <ProgressBadge label="Income" value={`$${monthlyIncome}`} tone="money" />
          <ProgressBadge label="Remaining" value={`$${remaining}`} tone={remaining >= 0 ? "money" : "danger"} />
        </div>
      </div>

      <p className="intro-copy">
        Build a monthly student budget and see your remaining balance in real time. Try reducing non-essentials to grow savings.
      </p>

      <div className="budget-grid">
        <label className="field">
          Monthly Income
          <input
            type="number"
            min="0"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
          />
        </label>

        {expenses.map((expense, index) => (
          <label className="field" key={expense.name}>
            {expense.name}
            <input
              type="number"
              min="0"
              value={expense.value}
              onChange={(e) => updateExpense(index, e.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="budget-summary">
        <p>Total Expenses: <strong>${totalExpenses}</strong></p>
        <p>Remaining Balance: <strong>${remaining}</strong></p>
      </div>

      <button className="primary-btn money-btn" onClick={saveBudget}>Save Budget Progress</button>
    </section>
  );
}
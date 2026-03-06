import { useState } from "react";
import QuizQuestion from "../components/QuizQuestion";
import ProgressBadge from "../components/ProgressBadge";
import { collegeLookFor, collegeMatches, collegeQuiz } from "../data";
import { updateAppData } from "../storage";

export default function CollegeMatch() {
  const [answers, setAnswers] = useState({});
  const [matches, setMatches] = useState([]);
  const [matchType, setMatchType] = useState("Not scored");

  const canSubmit = Object.keys(answers).length === collegeQuiz.length;

  function handleAnswer(index, label) {
    setAnswers((prev) => ({ ...prev, [index]: label }));
  }

  function calculateMatch() {
    const tally = { Urban: 0, Balanced: 0, Classic: 0 };

    collegeQuiz.forEach((q, idx) => {
      const selected = q.options.find((opt) => opt.label === answers[idx]);
      if (selected) tally[selected.type] += 1;
    });

    const winner = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
    setMatchType(winner);
    setMatches(collegeMatches[winner]);

    updateAppData((current) => ({
      ...current,
      progress: { ...current.progress, collegeComplete: true },
      scores: { ...current.scores, college: `${winner} learner` }
    }));
  }

  function saveFavoriteCollege(name) {
    updateAppData((current) => {
      const exists = current.favorites.some((f) => f.type === "college" && f.name === name);
      if (exists) return current;
      return {
        ...current,
        favorites: [...current.favorites, { type: "college", name }]
      };
    });
  }

  return (
    <section className="section-card module-card">
      <div className="section-header">
        <div>
          <h2>College Match Module</h2>
          <p className="intro-copy">Discover the campus style that fits how you learn and grow.</p>
        </div>
        <div className="badge-row">
          <ProgressBadge label="Answered" value={`${Object.keys(answers).length}/${collegeQuiz.length}`} tone="default" />
          <ProgressBadge label="Match Type" value={matchType} tone="default" />
        </div>
      </div>

      {collegeQuiz.map((question, idx) => (
        <QuizQuestion
          key={question.prompt}
          prompt={question.prompt}
          options={question.options}
          selected={answers[idx]}
          onSelect={(value) => handleAnswer(idx, value)}
        />
      ))}

      <button className="primary-btn" disabled={!canSubmit} onClick={calculateMatch}>
        Show My College Matches
      </button>

      {matches.length > 0 && (
        <div className="result-card">
          <h3>Sample College Recommendations</h3>
          <div className="recommend-grid">
            {matches.map((college) => (
              <article key={college.name} className="mini-card">
                <h4>{college.name}</h4>
                <p>{college.reason}</p>
                <button className="chip" onClick={() => saveFavoriteCollege(college.name)}>
                  + Favorite
                </button>
              </article>
            ))}
          </div>
        </div>
      )}

      <article className="look-for-block">
        <h3>What Colleges Look For</h3>
        <div className="look-grid">
          {collegeLookFor.map((item) => (
            <div className="look-card" key={item}>
              {item}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

import { useMemo, useState } from "react";
import QuizQuestion from "../components/QuizQuestion";
import ProgressBadge from "../components/ProgressBadge";
import { careerQuiz, careerResults } from "../data";
import { updateAppData } from "../storage";

export default function CareerPath() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const answeredCount = Object.keys(answers).length;

  const canSubmit = answeredCount === careerQuiz.length;

  const scoreLabel = useMemo(() => {
    if (!result) return "Not scored";
    return result.title;
  }, [result]);

  function handleAnswer(index, label) {
    setAnswers((prev) => ({ ...prev, [index]: label }));
  }

  function finishQuiz() {
    const tally = { Technology: 0, Healthcare: 0, Business: 0 };

    careerQuiz.forEach((q, idx) => {
      const selected = q.options.find((o) => o.label === answers[idx]);
      if (selected) tally[selected.tag] += 1;
    });

    const winner = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
    const picked = careerResults[winner];
    setResult(picked);

    updateAppData((current) => ({
      ...current,
      progress: { ...current.progress, careerComplete: true },
      scores: { ...current.scores, career: picked.title }
    }));
  }

  function saveFavorite(career) {
    updateAppData((current) => {
      const exists = current.favorites.some((f) => f.type === "career" && f.name === career);
      if (exists) return current;
      return {
        ...current,
        favorites: [...current.favorites, { type: "career", name: career }]
      };
    });
  }

  return (
    <section className="section-card career-theme">
      <div className="section-header">
        <h2>Career Path Quiz</h2>
        <div className="badge-row">
          <ProgressBadge label="Answered" value={`${answeredCount}/${careerQuiz.length}`} tone="career" />
          <ProgressBadge label="Current Result" value={scoreLabel} tone="career" />
        </div>
      </div>

      {careerQuiz.map((question, index) => (
        <QuizQuestion
          key={question.prompt}
          prompt={question.prompt}
          options={question.options}
          selected={answers[index]}
          onSelect={(value) => handleAnswer(index, value)}
        />
      ))}

      <button className="primary-btn career-btn" disabled={!canSubmit} onClick={finishQuiz}>
        See My Career Match
      </button>

      {result && (
        <article className="result-card career-theme-sub">
          <h3>{result.title}</h3>
          <p>{result.blurb}</p>
          <p className="mini-label">Recommended Careers</p>
          <div className="chip-row">
            {result.careers.map((career) => (
              <button key={career} className="chip" onClick={() => saveFavorite(career)}>
                + Favorite {career}
              </button>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}
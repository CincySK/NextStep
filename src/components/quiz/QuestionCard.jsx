export default function QuestionCard({ question, selectedValue, onSelect }) {
  return (
    <article className="quiz-flow-card quiz-question-card">
      <div className="quiz-question-head">
        <div>
          <p className="quiz-flow-label">Guided question</p>
          <h2>{question.title}</h2>
        </div>
        <span className="status-chip status-recommended">{question.options.length} options</span>
      </div>
      {question.helper && <p className="intro-copy">{question.helper}</p>}
      <div className="quiz-choice-grid">
        {question.options.map((option) => (
          <button
            key={option.value}
            className={`quiz-choice ${selectedValue === option.value ? "quiz-choice-selected" : ""}`}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </article>
  );
}

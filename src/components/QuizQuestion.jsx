export default function QuizQuestion({ prompt, options, selected, onSelect }) {
  return (
    <section className="quiz-block">
      <h3>{prompt}</h3>
      <div className="option-grid">
        {options.map((option) => (
          <button
            key={option.label}
            className={`option-btn ${selected === option.label ? "option-selected" : ""}`}
            onClick={() => onSelect(option.label)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
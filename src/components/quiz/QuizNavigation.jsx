export default function QuizNavigation({
  canGoBack,
  canGoNext,
  nextLabel = "Next",
  onBack,
  onNext
}) {
  return (
    <div className="quiz-nav">
      <button className="secondary-btn" onClick={onBack} disabled={!canGoBack}>
        Back
      </button>
      <button className="primary-btn" onClick={onNext} disabled={!canGoNext}>
        {nextLabel}
      </button>
    </div>
  );
}

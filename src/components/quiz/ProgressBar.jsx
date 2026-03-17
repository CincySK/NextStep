export default function ProgressBar({ currentStep, totalSteps, label }) {
  const safeTotal = Math.max(totalSteps, 1);
  const percent = Math.min(100, Math.round((currentStep / safeTotal) * 100));
  const stageLabel = percent < 35 ? "Getting started" : percent < 75 ? "Building your profile" : "Finalizing your fit";

  return (
    <div className="quiz-progress-wrap quiz-progress-card">
      <div className="quiz-progress-header">
        <p>{label}</p>
        <p>{currentStep}/{safeTotal}</p>
      </div>
      <div className="quiz-progress-track" aria-hidden>
        <div className="quiz-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="quiz-progress-footer">
        <p className="quiz-meta">{stageLabel}</p>
        <span className="status-chip status-active">{percent}% complete</span>
      </div>
    </div>
  );
}

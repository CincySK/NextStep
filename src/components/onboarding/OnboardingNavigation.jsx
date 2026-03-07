export default function OnboardingNavigation({
  canGoBack,
  canGoNext,
  nextLabel,
  onBack,
  onNext
}) {
  return (
    <div className="onboarding-nav">
      <button className="secondary-btn" onClick={onBack} disabled={!canGoBack}>
        Back
      </button>
      <button className="primary-btn" onClick={onNext} disabled={!canGoNext}>
        {nextLabel}
      </button>
    </div>
  );
}

export default function OnboardingProgress({ currentStep, totalSteps }) {
  const safeTotal = Math.max(totalSteps, 1);
  const percent = Math.round((currentStep / safeTotal) * 100);

  return (
    <div className="onboarding-progress">
      <div className="onboarding-progress-head">
        <p>Step {currentStep} of {safeTotal}</p>
        <p>{percent}%</p>
      </div>
      <div className="onboarding-progress-track" aria-hidden>
        <div className="onboarding-progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

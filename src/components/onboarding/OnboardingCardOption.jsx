export default function OnboardingCardOption({ label, selected, onClick }) {
  return (
    <button
      className={`onboarding-option ${selected ? "onboarding-option-selected" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

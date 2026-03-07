export default function OnboardingCardOption({ label, description, selected, onClick }) {
  return (
    <button
      type="button"
      className={`onboarding-option ${selected ? "onboarding-option-selected" : ""}`}
      onClick={onClick}
    >
      <span>{label}</span>
      {description && <small>{description}</small>}
    </button>
  );
}

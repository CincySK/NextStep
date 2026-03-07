import OnboardingCardOption from "./OnboardingCardOption";

const pathOptions = [
  {
    value: "career",
    label: "Explore Careers",
    description: "Discover career matches, majors, and skills based on your strengths."
  },
  {
    value: "college",
    label: "Find Colleges",
    description: "Get a personalized college-fit profile and smarter research priorities."
  },
  {
    value: "money",
    label: "Build Money Skills",
    description: "Practice real-life money decisions and improve financial confidence."
  }
];

export default function OnboardingPathSelector({ selectedPath, onSelect }) {
  return (
    <section className="onboarding-step">
      <h1>Choose your primary path</h1>
      <p>Select where you want to start. We will guide you into that quiz first.</p>
      <div className="onboarding-options onboarding-path-grid">
        {pathOptions.map((option) => (
          <OnboardingCardOption
            key={option.value}
            label={option.label}
            description={option.description}
            selected={selectedPath === option.value}
            onClick={() => onSelect(option.value)}
          />
        ))}
      </div>
    </section>
  );
}

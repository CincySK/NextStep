import OnboardingCardOption from "./OnboardingCardOption";

export default function OnboardingStep({ step, value, onChange }) {
  if (step.kind === "welcome" || step.kind === "completion") {
    return (
      <section className="onboarding-step">
        <h1>{step.title}</h1>
        <p>{step.description}</p>
      </section>
    );
  }

  if (step.kind === "multi_select_cards" || step.kind === "chips_multi") {
    const selectedValues = value ?? [];
    return (
      <section className="onboarding-step">
        <h1>{step.title}</h1>
        <div className={`onboarding-options ${step.kind === "chips_multi" ? "onboarding-chips" : ""}`}>
          {step.options.map((option) => (
            <OnboardingCardOption
              key={option.value}
              label={option.label}
              selected={selectedValues.includes(option.value)}
              onClick={() => {
                if (selectedValues.includes(option.value)) {
                  onChange(selectedValues.filter((item) => item !== option.value));
                  return;
                }
                onChange([...selectedValues, option.value]);
              }}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="onboarding-step">
      <h1>{step.title}</h1>
      <div className="onboarding-options">
        {step.options.map((option) => (
          <OnboardingCardOption
            key={option.value}
            label={option.label}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </section>
  );
}

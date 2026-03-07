import { useMemo, useState } from "react";
import { savePrimaryPathSelection } from "../../onboarding/onboardingStorage";
import OnboardingNavigation from "./OnboardingNavigation";
import OnboardingProgress from "./OnboardingProgress";
import OnboardingPathSelector from "./OnboardingPathSelector";

const steps = [
  {
    id: "welcome",
    title: "Welcome to NextStep",
    description:
      "NextStep helps you explore your future. Start with the area you want help with most.",
    nextLabel: "Get Started"
  },
  {
    id: "primaryPath",
    nextLabel: "Start This Path"
  }
];

const routeByPath = {
  career: "/career/quiz",
  college: "/college/quiz",
  money: "/money"
};

export default function OnboardingContainer({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedPath, setSelectedPath] = useState("");

  const step = steps[stepIndex];
  const progressStep = Math.min(stepIndex + 1, steps.length);

  const canContinue = useMemo(() => {
    if (step.id === "welcome") return true;
    return Boolean(selectedPath);
  }, [selectedPath, step.id]);

  function handleNext() {
    if (step.id === "primaryPath") {
      const state = savePrimaryPathSelection(selectedPath);
      onComplete({
        primaryPath: state.primaryPath,
        targetRoute: routeByPath[state.primaryPath] ?? "/dashboard"
      });
      return;
    }
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function handleBack() {
    if (stepIndex === 0) return;
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }

  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true" aria-label="NextStep onboarding">
      <div className="onboarding-shell">
        <OnboardingProgress currentStep={progressStep} totalSteps={steps.length} />
        <div key={step.id} className="onboarding-stage">
          {step.id === "welcome" && (
            <section className="onboarding-step">
              <h1>{step.title}</h1>
              <p>{step.description}</p>
            </section>
          )}
          {step.id === "primaryPath" && (
            <OnboardingPathSelector selectedPath={selectedPath} onSelect={setSelectedPath} />
          )}
        </div>
        <OnboardingNavigation
          canGoBack={stepIndex > 0}
          canGoNext={canContinue}
          nextLabel={step.nextLabel ?? "Next"}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}

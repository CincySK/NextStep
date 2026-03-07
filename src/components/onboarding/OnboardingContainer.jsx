import { useMemo, useState } from "react";
import { completeOnboarding } from "../../onboarding/onboardingStorage";
import OnboardingNavigation from "./OnboardingNavigation";
import OnboardingProgress from "./OnboardingProgress";
import OnboardingStep from "./OnboardingStep";

const steps = [
  {
    id: "welcome",
    kind: "welcome",
    title: "Welcome to NextStep",
    description:
      "NextStep helps you explore careers, discover colleges, and build important life skills. Let's personalize your experience.",
    nextLabel: "Get Started"
  },
  {
    id: "ageGroup",
    kind: "single",
    title: "What age group are you in?",
    options: [
      { value: "middle_school", label: "Middle School (11-13)" },
      { value: "high_school", label: "High School (14-18)" },
      { value: "college_student", label: "College Student" },
      { value: "after_school", label: "Exploring careers after school" }
    ]
  },
  {
    id: "helpAreas",
    kind: "multi_select_cards",
    title: "What would you like help with the most?",
    options: [
      { value: "careers", label: "Exploring careers" },
      { value: "colleges", label: "Finding colleges that fit me" },
      { value: "future_path", label: "Planning my future path" },
      { value: "money", label: "Learning financial skills" },
      { value: "all", label: "All of the above" }
    ]
  },
  {
    id: "learningGoals",
    kind: "single",
    title: "What are you hoping to learn?",
    options: [
      { value: "career_match", label: "What careers match my interests" },
      { value: "majors", label: "What majors I should consider" },
      { value: "college_requirements", label: "What colleges look for" },
      { value: "money_skills", label: "How to manage money" },
      { value: "future_planning", label: "How to plan my future" }
    ]
  },
  {
    id: "interests",
    kind: "chips_multi",
    optional: true,
    title: "What topics or fields interest you?",
    options: [
      { value: "technology", label: "Technology" },
      { value: "healthcare", label: "Healthcare" },
      { value: "business", label: "Business" },
      { value: "arts_design", label: "Arts & Design" },
      { value: "science", label: "Science" },
      { value: "education", label: "Education" },
      { value: "law_government", label: "Law / Government" },
      { value: "not_sure", label: "Not sure yet" }
    ]
  },
  {
    id: "complete",
    kind: "completion",
    title: "You're all set!",
    description: "We've customized NextStep based on your interests. You can update this anytime.",
    nextLabel: "Start Exploring"
  }
];

function getInitialAnswers() {
  return {
    ageGroup: "",
    helpAreas: [],
    learningGoals: "",
    interests: []
  };
}

export default function OnboardingContainer({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(getInitialAnswers());

  const step = steps[stepIndex];
  const progressStep = Math.min(stepIndex + 1, steps.length);

  const canContinue = useMemo(() => {
    if (step.kind === "welcome" || step.kind === "completion") return true;
    const value = answers[step.id];
    if (step.optional) return true;
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
  }, [answers, step]);

  function updateAnswer(value) {
    setAnswers((prev) => ({ ...prev, [step.id]: value }));
  }

  function handleNext() {
    if (step.id === "complete") {
      completeOnboarding(answers);
      onComplete(answers);
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
          <OnboardingStep
            step={step}
            value={answers[step.id]}
            onChange={updateAnswer}
          />
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

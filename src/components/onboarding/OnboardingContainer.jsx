import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import {
  clearOnboardingDraft,
  completeOnboarding,
  loadOnboardingDraft,
  saveOnboardingDraft,
  savePrimaryPathSelection
} from "../../onboarding/onboardingStorage";
import OnboardingNavigation from "./OnboardingNavigation";
import OnboardingProgress from "./OnboardingProgress";
import OnboardingPathSelector from "./OnboardingPathSelector";

const steps = [
  { id: "welcome", nextLabel: "Continue" },
  { id: "primaryPath", nextLabel: "Continue" },
  { id: "ageGroup", nextLabel: "Continue" },
  { id: "interestAreas", nextLabel: "Continue" },
  { id: "accountChoice", nextLabel: "Continue as Guest" },
  { id: "startQuiz", nextLabel: "Start First Quiz" }
];

const routeByPath = {
  career: "/career/quiz",
  college: "/college/quiz",
  money: "/money"
};

const ageOptions = [
  { value: "middle_school", label: "Middle School (11-13)" },
  { value: "high_school", label: "High School (14-18)" },
  { value: "college_student", label: "College Student" },
  { value: "after_school", label: "Exploring careers after school" }
];

const interestOptions = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "business", label: "Business" },
  { value: "arts_design", label: "Arts & Design" },
  { value: "science", label: "Science" },
  { value: "education", label: "Education" },
  { value: "law_government", label: "Law / Government" },
  { value: "not_sure", label: "Not sure yet" }
];

function initialState() {
  const draft = loadOnboardingDraft();
  if (draft) {
    return {
      stepIndex: draft.stepIndex ?? 0,
      selectedPath: draft.selectedPath ?? "",
      ageGroup: draft.ageGroup ?? "",
      interests: draft.interests ?? []
    };
  }
  return {
    stepIndex: 0,
    selectedPath: "",
    ageGroup: "",
    interests: []
  };
}

export default function OnboardingContainer({ onComplete }) {
  const navigate = useNavigate();
  const { enableGuestMode, isAuthenticated } = useAuth();
  const state = initialState();
  const [stepIndex, setStepIndex] = useState(state.stepIndex);
  const [selectedPath, setSelectedPath] = useState(state.selectedPath);
  const [ageGroup, setAgeGroup] = useState(state.ageGroup);
  const [interests, setInterests] = useState(state.interests);

  const step = steps[stepIndex];
  const progressStep = stepIndex + 1;

  const canContinue = useMemo(() => {
    if (step.id === "welcome") return true;
    if (step.id === "primaryPath") return Boolean(selectedPath);
    if (step.id === "ageGroup") return Boolean(ageGroup);
    if (step.id === "interestAreas") return interests.length > 0;
    if (step.id === "accountChoice") return true;
    return Boolean(selectedPath);
  }, [ageGroup, interests.length, selectedPath, step.id]);

  function persistDraft(nextStep = stepIndex) {
    saveOnboardingDraft({
      stepIndex: nextStep,
      selectedPath,
      ageGroup,
      interests
    });
  }

  function advance() {
    const next = Math.min(stepIndex + 1, steps.length - 1);
    setStepIndex(next);
    persistDraft(next);
  }

  function handleBack() {
    if (stepIndex === 0) return;
    const next = Math.max(stepIndex - 1, 0);
    setStepIndex(next);
    persistDraft(next);
  }

  function handleAuthChoice(target) {
    persistDraft(stepIndex);
    navigate(target, { state: { resumeOnboarding: true } });
    onComplete({ closeOnly: true });
  }

  function handleGuestChoice() {
    enableGuestMode();
    advance();
  }

  function handleNext() {
    if (step.id === "primaryPath") {
      savePrimaryPathSelection(selectedPath);
      advance();
      return;
    }
    if (step.id === "accountChoice") {
      handleGuestChoice();
      return;
    }
    if (step.id === "startQuiz") {
      completeOnboarding({
        primaryPath: selectedPath,
        ageGroup,
        interests,
        sessionMode: isAuthenticated ? "authenticated" : "guest",
        firstQuizType: selectedPath,
        firstQuizCompletedAt: null
      });
      clearOnboardingDraft();
      onComplete({
        primaryPath: selectedPath,
        targetRoute: routeByPath[selectedPath] ?? "/dashboard"
      });
      return;
    }
    advance();
  }

  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true" aria-label="NextStep onboarding">
      <div className="onboarding-shell">
        <OnboardingProgress currentStep={progressStep} totalSteps={steps.length} />
        <div key={step.id} className="onboarding-stage">
          {step.id === "welcome" && (
            <section className="onboarding-step">
              <h1>Welcome to NextStep</h1>
              <p>NextStep helps you explore your future in careers, college planning, and life skills.</p>
            </section>
          )}

          {step.id === "primaryPath" && (
            <OnboardingPathSelector selectedPath={selectedPath} onSelect={setSelectedPath} />
          )}

          {step.id === "ageGroup" && (
            <section className="onboarding-step">
              <h1>What age group are you in?</h1>
              <div className="onboarding-options">
                {ageOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={`onboarding-option ${ageGroup === option.value ? "onboarding-option-selected" : ""}`}
                    onClick={() => setAgeGroup(option.value)}
                  >
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step.id === "interestAreas" && (
            <section className="onboarding-step">
              <h1>What topics interest you most?</h1>
              <div className="onboarding-options onboarding-chips">
                {interestOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={`onboarding-option ${interests.includes(option.value) ? "onboarding-option-selected" : ""}`}
                    onClick={() => {
                      setInterests((prev) => prev.includes(option.value)
                        ? prev.filter((value) => value !== option.value)
                        : [...prev, option.value]);
                    }}
                  >
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step.id === "accountChoice" && (
            <section className="onboarding-step">
              <h1>Save your progress?</h1>
              <p>You can create an account to save quiz results, dashboard progress, and future plans.</p>
              <div className="onboarding-benefits">
                <span className="signal-chip">Save your results</span>
                <span className="signal-chip">Track your progress</span>
                <span className="signal-chip">Return anytime</span>
              </div>
              <div className="onboarding-auth-actions">
                <button type="button" className="primary-btn" onClick={() => handleAuthChoice("/signup")}>Sign up / Create account</button>
                <button type="button" className="secondary-btn" onClick={() => handleAuthChoice("/login")}>Log in</button>
                <button type="button" className="onboarding-link-btn" onClick={handleGuestChoice}>Continue as Guest</button>
              </div>
            </section>
          )}

          {step.id === "startQuiz" && (
            <section className="onboarding-step">
              <h1>You&apos;re ready to start</h1>
              <p>We&apos;ll guide you into your first quiz and personalize the experience as you go.</p>
            </section>
          )}
        </div>

        {step.id !== "accountChoice" && (
          <OnboardingNavigation
            canGoBack={stepIndex > 0}
            canGoNext={canContinue}
            nextLabel={step.nextLabel ?? "Next"}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}

import { completeOnboarding, loadOnboardingState } from "../onboarding/onboardingStorage";
import { buildUserProfileFromQuiz } from "./personalizationEngine";
import { savePersonalizationProfile } from "./personalizationStorage";

export function finalizeFirstQuizPersonalization({ quizType, answers, result }) {
  const onboardingState = loadOnboardingState();
  if (!onboardingState?.primaryPath) return null;
  if (onboardingState.primaryPath !== quizType) return null;

  const profile = buildUserProfileFromQuiz({
    primaryPath: onboardingState.primaryPath,
    answers,
    result
  });

  savePersonalizationProfile(profile);
  completeOnboarding({
    primaryPath: onboardingState.primaryPath,
    firstQuizType: quizType,
    firstQuizCompletedAt: new Date().toISOString()
  });

  return profile;
}

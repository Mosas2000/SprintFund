import { ONBOARDING_TOUR_STEPS } from '../config/onboarding-tour';

export function getStepById(stepId: string) {
  return ONBOARDING_TOUR_STEPS.find((step) => step.id === stepId);
}

export function getStepIndex(stepId: string): number {
  return ONBOARDING_TOUR_STEPS.findIndex((step) => step.id === stepId);
}

export function getNextStepId(currentStepId: string): string | null {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex === -1 || currentIndex >= ONBOARDING_TOUR_STEPS.length - 1) {
    return null;
  }
  return ONBOARDING_TOUR_STEPS[currentIndex + 1].id;
}

export function getPreviousStepId(currentStepId: string): string | null {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex <= 0) {
    return null;
  }
  return ONBOARDING_TOUR_STEPS[currentIndex - 1].id;
}

export function calculateProgress(completedSteps: string[]): number {
  const totalSteps = ONBOARDING_TOUR_STEPS.length;
  const completed = completedSteps.length;
  return Math.round((completed / totalSteps) * 100);
}

export function isOnboardingComplete(completedSteps: string[]): boolean {
  return completedSteps.length === ONBOARDING_TOUR_STEPS.length;
}

export function getRemainingSteps(completedSteps: string[]): string[] {
  return ONBOARDING_TOUR_STEPS.filter(
    (step) => !completedSteps.includes(step.id)
  ).map((step) => step.id);
}

export function getCompletedStepsCount(completedSteps: string[]): number {
  return completedSteps.filter((stepId) =>
    ONBOARDING_TOUR_STEPS.some((step) => step.id === stepId)
  ).length;
}

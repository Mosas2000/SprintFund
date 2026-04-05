import { useCallback } from 'react';
import { useOnboardingStore } from '../store/onboarding';
import { ONBOARDING_TOUR_STEPS } from '../config/onboarding-tour';

export function useOnboarding() {
  const {
    isFirstTime,
    currentStep,
    completedSteps,
    showModal,
    showChecklist,
    setCurrentStep,
    setShowModal,
    setShowChecklist,
    markStepComplete,
    resetOnboarding,
  } = useOnboardingStore();

  const completeStep = useCallback(
    (stepId: string) => {
      markStepComplete(stepId);
    },
    [markStepComplete]
  );

  const goToStep = useCallback(
    (stepId: string) => {
      const stepIndex = ONBOARDING_TOUR_STEPS.findIndex((s) => s.id === stepId);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
      }
    },
    [setCurrentStep]
  );

  const skipOnboarding = useCallback(() => {
    setShowModal(false);
    localStorage.setItem('sprintfund_onboarding_completed', 'true');
  }, [setShowModal]);

  const resumeOnboarding = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);

  const hideChecklist = useCallback(() => {
    setShowChecklist(false);
  }, [setShowChecklist]);

  const showOnboardingChecklist = useCallback(() => {
    setShowChecklist(true);
  }, [setShowChecklist]);

  const isStepCompleted = useCallback(
    (stepId: string) => completedSteps.includes(stepId),
    [completedSteps]
  );

  const getCompletionPercentage = useCallback(() => {
    return Math.round((completedSteps.length / ONBOARDING_TOUR_STEPS.length) * 100);
  }, [completedSteps]);

  return {
    isFirstTime,
    currentStep,
    completedSteps,
    showModal,
    showChecklist,
    completeStep,
    goToStep,
    skipOnboarding,
    resumeOnboarding,
    hideChecklist,
    showOnboardingChecklist,
    isStepCompleted,
    getCompletionPercentage,
    resetOnboarding,
    setShowModal,
  };
}

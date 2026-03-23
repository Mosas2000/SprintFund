import { useOnboardingStore } from '../store/onboarding';

export function useOnboardingDebug() {
  const {
    isFirstTime,
    currentStep,
    completedSteps,
    resetOnboarding,
  } = useOnboardingStore();

  const resetAndRestart = () => {
    resetOnboarding();
    window.location.reload();
  };

  const getOnboardingStatus = () => {
    return {
      isFirstTime,
      currentStep,
      completedSteps,
      completedPercentage: Math.round((completedSteps.length / 6) * 100),
      storageData: {
        firstVisit: localStorage.getItem('sprintfund_first_visit'),
        onboardingCompleted: localStorage.getItem('sprintfund_onboarding_completed'),
        completedSteps: localStorage.getItem('sprintfund_onboarding_steps'),
      },
    };
  };

  const clearAllOnboardingData = () => {
    localStorage.removeItem('sprintfund_first_visit');
    localStorage.removeItem('sprintfund_onboarding_completed');
    localStorage.removeItem('sprintfund_onboarding_steps');
    resetOnboarding();
  };

  return {
    resetAndRestart,
    getOnboardingStatus,
    clearAllOnboardingData,
  };
}

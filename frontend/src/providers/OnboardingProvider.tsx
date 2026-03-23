import React, { useEffect, ReactNode, useState } from 'react';
import { useOnboardingStore } from '../store/onboarding';
import { isFirstTimeVisitor, markVisitorAsReturning } from '../utils/first-time-visitor';
import { OnboardingModal } from '../components/OnboardingModal';
import { OnboardingChecklist } from '../components/OnboardingChecklist';
import { SkipOnboardingDialog } from '../components/SkipOnboardingDialog';
import { ONBOARDING_TOUR_STEPS } from '../config/onboarding-tour';

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const {
    isFirstTime,
    currentStep,
    completedSteps,
    showModal,
    showChecklist,
    setIsFirstTime,
    setCurrentStep,
    setShowModal,
    setShowChecklist,
    markStepComplete,
    initialize,
  } = useOnboardingStore();

  const [showSkipDialog, setShowSkipDialog] = useState(false);

  useEffect(() => {
    initialize();
    if (isFirstTimeVisitor()) {
      markVisitorAsReturning();
      setIsFirstTime(true);
      setShowModal(true);
      setShowChecklist(true);
    }
  }, [setIsFirstTime, setShowModal, setShowChecklist, initialize]);

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteOnboarding = () => {
    setShowModal(false);
    localStorage.setItem('sprintfund_onboarding_completed', 'true');
    setIsFirstTime(false);
  };

  const handleCloseModal = () => {
    setShowSkipDialog(true);
  };

  const handleConfirmSkip = () => {
    setShowModal(false);
    setShowSkipDialog(false);
    localStorage.setItem('sprintfund_onboarding_completed', 'true');
    setIsFirstTime(false);
  };

  const handleCancelSkip = () => {
    setShowSkipDialog(false);
  };

  const handleStepClick = (stepId: string) => {
    const stepIndex = ONBOARDING_TOUR_STEPS.findIndex((s) => s.id === stepId);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
      setShowModal(true);
    }
    markStepComplete(stepId);
  };

  const handleDismissChecklist = () => {
    setShowChecklist(false);
  };

  return (
    <>
      {children}
      {showModal && (
        <OnboardingModal
          isOpen={showModal}
          currentStep={currentStep}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
          onClose={handleCloseModal}
          onComplete={handleCompleteOnboarding}
        />
      )}
      {showChecklist && isFirstTime && (
        <OnboardingChecklist
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
          onDismiss={handleDismissChecklist}
        />
      )}
      <SkipOnboardingDialog
        isOpen={showSkipDialog}
        onConfirm={handleConfirmSkip}
        onCancel={handleCancelSkip}
      />
    </>
  );
}

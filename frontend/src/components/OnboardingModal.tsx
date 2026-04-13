import React from 'react';
import { ONBOARDING_TOUR_STEPS } from '../config/onboarding-tour';
import { OnboardingTooltip } from './OnboardingTooltip';

interface OnboardingModalProps {
  isOpen: boolean;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingModal({
  isOpen,
  currentStep,
  onNext,
  onPrev,
  onClose,
  onComplete,
}: OnboardingModalProps) {
  if (!isOpen) return null;

  const step = ONBOARDING_TOUR_STEPS[currentStep];
  if (!step) return null;

  const isFirst = currentStep === 0;
  const isLast = currentStep === ONBOARDING_TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <OnboardingTooltip
      title={step.title}
      description={step.description}
      concepts={step.concepts}
      position={step.position || 'center'}
      onClose={onClose}
      onNext={handleNext}
      onPrev={onPrev}
      isFirst={isFirst}
      isLast={isLast}
      stepNumber={currentStep + 1}
      totalSteps={ONBOARDING_TOUR_STEPS.length}
    />
  );
}

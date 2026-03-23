import { renderHook, act } from '@testing-library/react';
import { useOnboardingStore } from '../store/onboarding';

export function resetOnboardingForTesting() {
  localStorage.removeItem('sprintfund_first_visit');
  localStorage.removeItem('sprintfund_onboarding_completed');
  localStorage.removeItem('sprintfund_onboarding_steps');
}

export function setupFirstTimeVisitor() {
  resetOnboardingForTesting();
}

export function setupReturningVisitor() {
  localStorage.setItem('sprintfund_first_visit', JSON.stringify({ timestamp: Date.now() }));
  localStorage.setItem('sprintfund_onboarding_completed', 'true');
}

export function setupPartialOnboarding(completedSteps: string[]) {
  resetOnboardingForTesting();
  localStorage.setItem('sprintfund_onboarding_steps', JSON.stringify(completedSteps));
}

export function mockOnboardingState(overrides = {}) {
  return {
    isFirstTime: true,
    currentStep: 0,
    completedSteps: [],
    showModal: false,
    showChecklist: false,
    steps: [],
    setIsFirstTime: jest.fn(),
    setCurrentStep: jest.fn(),
    markStepComplete: jest.fn(),
    setShowModal: jest.fn(),
    setShowChecklist: jest.fn(),
    shouldShowOnboarding: jest.fn(() => true),
    resetOnboarding: jest.fn(),
    initialize: jest.fn(),
    ...overrides,
  };
}

export function getOnboardingStorageData() {
  return {
    firstVisit: localStorage.getItem('sprintfund_first_visit'),
    completed: localStorage.getItem('sprintfund_onboarding_completed'),
    steps: localStorage.getItem('sprintfund_onboarding_steps'),
  };
}

export function simulateStepCompletion(stepId: string) {
  const { result } = renderHook(() => useOnboardingStore());
  act(() => {
    result.current.markStepComplete(stepId);
  });
}

export function getCompletedStepsFromStorage(): string[] {
  const stepsData = localStorage.getItem('sprintfund_onboarding_steps');
  if (!stepsData) return [];
  try {
    return JSON.parse(stepsData);
  } catch {
    return [];
  }
}

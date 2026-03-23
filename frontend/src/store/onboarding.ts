import { create } from 'zustand';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  action: string;
  target: string;
  completed: boolean;
}

export interface OnboardingState {
  isFirstTime: boolean;
  currentStep: number;
  completedSteps: string[];
  showModal: boolean;
  showChecklist: boolean;
  steps: OnboardingStep[];
  setIsFirstTime: (value: boolean) => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (stepId: string) => void;
  setShowModal: (show: boolean) => void;
  setShowChecklist: (show: boolean) => void;
  shouldShowOnboarding: () => boolean;
  resetOnboarding: () => void;
  initialize: () => void;
}

const ONBOARDING_KEY = 'sprintfund_onboarding_completed';
const STEP_COMPLETION_KEY = 'sprintfund_onboarding_steps';

const DEFAULT_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to SprintFund',
    description: 'SprintFund is a DAO platform for decentralized decision-making through quadratic voting.',
    action: 'Let\'s get started',
    target: 'root',
    completed: false,
  },
  {
    id: 'wallet-connect',
    title: 'Connect Your Wallet',
    description: 'Connect your Stacks wallet to participate in governance and voting.',
    action: 'Connect wallet',
    target: 'wallet-button',
    completed: false,
  },
  {
    id: 'staking',
    title: 'Stake Your STX',
    description: 'Stake STX tokens to gain voting power and participate in proposals.',
    action: 'View dashboard',
    target: 'staking-section',
    completed: false,
  },
  {
    id: 'proposals',
    title: 'Browse Proposals',
    description: 'Explore active and past proposals in the DAO.',
    action: 'Browse proposals',
    target: 'proposals-section',
    completed: false,
  },
  {
    id: 'voting',
    title: 'Cast Your Vote',
    description: 'Use quadratic voting to voice your opinions on proposals.',
    action: 'Learn more',
    target: 'voting-info',
    completed: false,
  },
];

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  isFirstTime: true,
  currentStep: 0,
  completedSteps: [],
  showModal: false,
  showChecklist: false,
  steps: DEFAULT_STEPS,

  setIsFirstTime: (value) => set({ isFirstTime: value }),

  setCurrentStep: (step) => set({ currentStep: step }),

  markStepComplete: (stepId) => {
    const state = get();
    const completedSteps = [...state.completedSteps];
    if (!completedSteps.includes(stepId)) {
      completedSteps.push(stepId);
    }
    set({ completedSteps });
    localStorage.setItem(STEP_COMPLETION_KEY, JSON.stringify(completedSteps));
  },

  setShowModal: (show) => set({ showModal: show }),

  setShowChecklist: (show) => set({ showChecklist: show }),

  shouldShowOnboarding: () => {
    return get().isFirstTime && !localStorage.getItem(ONBOARDING_KEY);
  },

  resetOnboarding: () => {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(STEP_COMPLETION_KEY);
    set({
      isFirstTime: true,
      currentStep: 0,
      completedSteps: [],
      showModal: false,
      showChecklist: false,
      steps: DEFAULT_STEPS,
    });
  },

  initialize: () => {
    const isCompleted = localStorage.getItem(ONBOARDING_KEY);
    const savedSteps = localStorage.getItem(STEP_COMPLETION_KEY);

    if (isCompleted) {
      set({ isFirstTime: false, showModal: false });
    } else {
      set({ isFirstTime: true, showModal: true });
    }

    if (savedSteps) {
      try {
        const completedSteps = JSON.parse(savedSteps);
        set({ completedSteps });
      } catch (error) {
        console.error('Failed to parse saved onboarding steps:', error);
      }
    }
  },
}));

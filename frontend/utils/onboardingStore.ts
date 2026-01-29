'use client';

import { create } from 'zustand';

interface TourStep {
    target: string;
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingState {
    isActive: boolean;
    currentStep: number;
    steps: TourStep[];
    startTour: () => void;
    nextStep: () => void;
    endTour: () => void;
}

export const useOnboarding = create<OnboardingState>((set) => ({
    isActive: false,
    currentStep: 0,
    steps: [
        { target: '#nav-governance', title: 'Governance Hub', content: 'Explore active proposals and historical platform decisions.', position: 'bottom' },
        { target: '#btn-connect', title: 'Wallet Secure', content: 'Connect your Stacks wallet to participate in the DAO.', position: 'left' },
        { target: '#btn-create', title: 'Launch Idea', content: 'Draft your micro-grant proposal in seconds using our templates.', position: 'top' },
    ],
    startTour: () => set({ isActive: true, currentStep: 0 }),
    nextStep: () => set((state) => ({
        currentStep: state.currentStep < state.steps.length - 1 ? state.currentStep + 1 : state.currentStep,
        isActive: state.currentStep < state.steps.length - 1
    })),
    endTour: () => set({ isActive: false }),
}));

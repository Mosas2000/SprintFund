'use client';

import { create } from 'zustand';

interface XPAction {
    id: string;
    name: string;
    points: number;
}

const ACTIONS: Record<string, XPAction> = {
    VOTE: { id: 'vote', name: 'Cast Vote', points: 10 },
    PROPOSE: { id: 'propose', name: 'Submit Proposal', points: 50 },
    COMMENT: { id: 'comment', name: 'Join Discussion', points: 5 },
    FUNDED: { id: 'funded', name: 'Proposal Funded', points: 200 },
};

interface XPState {
    totalXP: number;
    level: number;
    history: { action: string; points: number; date: number }[];
    addXP: (actionKey: keyof typeof ACTIONS) => void;
}

export const usePlatformXP = create<XPState>((set, get) => ({
    totalXP: 0,
    level: 1,
    history: [],
    addXP: (actionKey) => {
        const action = ACTIONS[actionKey];
        const newXP = get().totalXP + action.points;
        const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

        set((state) => ({
            totalXP: newXP,
            level: newLevel,
            history: [{ action: action.name, points: action.points, date: Date.now() }, ...state.history].slice(0, 50)
        }));
    }
}));

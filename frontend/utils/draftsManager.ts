export interface ProposalDraft {
    id: string;
    title: string;
    description: string;
    amount: string;
    category: string;
    lastSaved: number;
}

const DRAFTS_KEY = 'sprintfund_proposal_drafts';

export function saveDraft(draft: ProposalDraft) {
    const existing = getDrafts();
    const index = existing.findIndex(d => d.id === draft.id);

    if (index >= 0) {
        existing[index] = draft;
    } else {
        existing.push(draft);
    }

    localStorage.setItem(DRAFTS_KEY, JSON.stringify(existing));
}

export function getDrafts(): ProposalDraft[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(DRAFTS_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function deleteDraft(id: string) {
    const existing = getDrafts();
    const filtered = existing.filter(d => d.id !== id);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(filtered));
}

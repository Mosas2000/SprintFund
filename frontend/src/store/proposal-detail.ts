import Zustand from 'zustand';
import { persist } from 'zustand/middleware';
import { ProposalDiscussionThread } from '@/types/proposal-detail';

/** Entry in the proposal execution history */
interface ExecutionHistoryEntry {
  txId: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  blockHeight?: number;
}

interface ProposalDetailStore {
  discussions: Record<string, ProposalDiscussionThread>;
  executionHistory: Record<string, ExecutionHistoryEntry[]>;
  addDiscussion: (proposalId: string, thread: ProposalDiscussionThread) => void;
  updateDiscussion: (proposalId: string, thread: ProposalDiscussionThread) => void;
  getDiscussion: (proposalId: string) => ProposalDiscussionThread | undefined;
  addExecutionHistory: (proposalId: string, entry: ExecutionHistoryEntry) => void;
  getExecutionHistory: (proposalId: string) => ExecutionHistoryEntry[];
  clearAll: () => void;
}

export const useProposalDetailStore = Zustand<ProposalDetailStore>(
  persist(
    (set, get) => ({
      discussions: {},
      executionHistory: {},

      addDiscussion: (proposalId: string, thread: ProposalDiscussionThread) => {
        set((state) => ({
          discussions: {
            ...state.discussions,
            [proposalId]: thread,
          },
        }));
      },

      updateDiscussion: (proposalId: string, thread: ProposalDiscussionThread) => {
        set((state) => ({
          discussions: {
            ...state.discussions,
            [proposalId]: thread,
          },
        }));
      },

      getDiscussion: (proposalId: string) => {
        return get().discussions[proposalId];
      },

      addExecutionHistory: (proposalId: string, entry: ExecutionHistoryEntry) => {
        set((state) => ({
          executionHistory: {
            ...state.executionHistory,
            [proposalId]: [...(state.executionHistory[proposalId] || []), entry],
          },
        }));
      },

      getExecutionHistory: (proposalId: string) => {
        return get().executionHistory[proposalId] || [];
      },

      clearAll: () => {
        set({
          discussions: {},
          executionHistory: {},
        });
      },
    }),
    {
      name: 'proposal-detail-store',
    }
  )
);

import { create } from 'zustand';
import type { Transaction, TransactionState, TransactionStatus, TransactionType } from '../types/transaction';

const STORAGE_KEY = 'sprintfund_transactions';

const loadFromStorage = (): Record<string, Transaction> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveToStorage = (transactions: Record<string, Transaction>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions to localStorage:', error);
  }
};

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: loadFromStorage(),

  addTransaction: (transaction: Transaction) => {
    set((state) => {
      const updated = {
        ...state.transactions,
        [transaction.id]: transaction,
      };
      saveToStorage(updated);
      return { transactions: updated };
    });
  },

  updateTransaction: (id: string, updates: Partial<Transaction>) => {
    set((state) => {
      const existing = state.transactions[id];
      if (!existing) return state;

      const updated = {
        ...state.transactions,
        [id]: { ...existing, ...updates },
      };
      saveToStorage(updated);
      return { transactions: updated };
    });
  },

  removeTransaction: (id: string) => {
    set((state) => {
      const { [id]: _, ...rest } = state.transactions;
      saveToStorage(rest);
      return { transactions: rest };
    });
  },

  getTransaction: (id: string) => {
    return get().transactions[id];
  },

  getTransactionsByType: (type: TransactionType) => {
    return Object.values(get().transactions).filter((tx) => tx.type === type);
  },

  getTransactionsByStatus: (status: TransactionStatus) => {
    return Object.values(get().transactions).filter((tx) => tx.status === status);
  },

  getPendingTransactions: () => {
    return Object.values(get().transactions).filter((tx) => tx.status === 'pending');
  },

  clearOldTransactions: (olderThanDays: number) => {
    const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
    set((state) => {
      const filtered = Object.entries(state.transactions).reduce(
        (acc, [id, tx]) => {
          if (tx.timestamp > cutoffTime || tx.status === 'pending') {
            acc[id] = tx;
          }
          return acc;
        },
        {} as Record<string, Transaction>,
      );
      saveToStorage(filtered);
      return { transactions: filtered };
    });
  },
}));

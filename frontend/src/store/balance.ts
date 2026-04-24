import { create } from 'zustand';
import { fetchWalletBalance, clearBalanceCache } from '../services/balance-service';
import type { WalletBalance } from '../types/balance';
import { normalizeError } from '../lib/error-normalizer';

interface BalanceStore {
  balance: WalletBalance | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  fetchBalance: (address: string) => Promise<void>;
  clearBalance: () => void;
  clearError: () => void;
}

export const useBalanceStore = create<BalanceStore>((set) => ({
  balance: null,
  loading: false,
  error: null,
  lastUpdated: null,

  fetchBalance: async (address: string) => {
    if (!address) {
      set({ balance: null, loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const balance = await fetchWalletBalance(address);
      set({ balance, loading: false, lastUpdated: Date.now() });
    } catch (err) {
      const normalized = normalizeError(err);
      const message = normalized.suggestion 
        ? `${normalized.message} Tip: ${normalized.suggestion}` 
        : normalized.message;
      set({ error: message, loading: false });
    }
  },

  clearBalance: () => {
    clearBalanceCache();
    set({ balance: null, lastUpdated: null });
  },

  clearError: () => set({ error: null }),
}));

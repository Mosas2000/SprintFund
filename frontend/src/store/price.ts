import { create } from 'zustand';
import { fetchStxPrice } from '../services/price-service';
import type { PriceData } from '../types/price';

interface PriceStore {
  price: PriceData | null;
  loading: boolean;
  error: string | null;
  fetchPrice: () => Promise<void>;
  clearError: () => void;
}

export const usePriceStore = create<PriceStore>((set) => ({
  price: null,
  loading: false,
  error: null,

  fetchPrice: async () => {
    set({ loading: true, error: null });
    try {
      const price = await fetchStxPrice();
      set({ price, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch price';
      set({ error: message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

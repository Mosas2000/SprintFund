import { create } from 'zustand';
import { normalizeError } from '../lib/error-normalizer';
import type { NormalizedError } from '../lib/error-normalizer';

interface ErrorState {
  errors: Map<string, NormalizedError>;
  addError: (id: string, error: unknown) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  getError: (id: string) => NormalizedError | undefined;
}

export const useErrorStore = create<ErrorState>((set, get) => ({
  errors: new Map(),

  addError: (id: string, error: unknown) => {
    set((state) => ({
      errors: new Map(state.errors).set(id, normalizeError(error)),
    }));
  },

  removeError: (id: string) => {
    set((state) => {
      const newErrors = new Map(state.errors);
      newErrors.delete(id);
      return { errors: newErrors };
    });
  },

  clearErrors: () => {
    set({ errors: new Map() });
  },

  getError: (id: string) => {
    return get().errors.get(id);
  },
}));

export const createAsyncErrorHandler = (contextId: string) => {
  return {
    handleError: (error: unknown) => {
      useErrorStore.getState().addError(contextId, error);
    },
    clearError: () => {
      useErrorStore.getState().removeError(contextId);
    },
    getError: () => {
      return useErrorStore.getState().getError(contextId);
    },
  };
};

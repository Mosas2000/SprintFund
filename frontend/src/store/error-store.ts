import { create } from 'zustand';
import { AsyncError, ErrorCode } from '../lib/async-errors';

interface ErrorState {
  errors: Map<string, AsyncError>;
  addError: (id: string, error: AsyncError) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  getError: (id: string) => AsyncError | undefined;
}

export const useErrorStore = create<ErrorState>((set, get) => ({
  errors: new Map(),

  addError: (id: string, error: AsyncError) => {
    set((state) => ({
      errors: new Map(state.errors).set(id, error),
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
    handleError: (error: AsyncError) => {
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

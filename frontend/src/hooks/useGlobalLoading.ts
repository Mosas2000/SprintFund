import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { LoadingState } from '../lib/loading-state';
import { createLoadingState, updateLoadingState } from '../lib/loading-state';

interface GlobalLoadingContextType {
  globalLoading: LoadingState;
  setGlobalLoading: (state: LoadingState) => void;
  startLoading: (message?: string) => void;
  completeLoading: () => void;
  failLoading: (error?: Error) => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [globalLoading, setGlobalLoading] = useState<LoadingState>(createLoadingState('idle'));

  const startLoading = useCallback((message?: string) => {
    setGlobalLoading(prev => ({
      ...updateLoadingState(prev, 'loading'),
      message,
    }));
  }, []);

  const completeLoading = useCallback(() => {
    setGlobalLoading(prev => updateLoadingState(prev, 'success'));
  }, []);

  const failLoading = useCallback((error?: Error) => {
    setGlobalLoading(prev => ({
      ...updateLoadingState(prev, 'error'),
      error,
    }));
  }, []);

  const value: GlobalLoadingContextType = {
    globalLoading,
    setGlobalLoading,
    startLoading,
    completeLoading,
    failLoading,
  };

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within GlobalLoadingProvider');
  }
  return context;
}

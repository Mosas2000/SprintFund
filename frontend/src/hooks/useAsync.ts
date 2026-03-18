/**
 * Hook for managing async loading states.
 */

import { useState, useCallback, useRef } from 'react';
import type { AsyncStatus, LoadingState } from '../lib/loading-state';
import { createLoadingState, updateLoadingState } from '../lib/loading-state';

interface UseAsyncOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for managing async operation state.
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  options?: UseAsyncOptions,
) {
  const [state, setState] = useState<LoadingState & { data?: T; error?: Error }>(
    createLoadingState('idle'),
  );

  const execute = useCallback(async () => {
    setState((s) => ({ ...s, ...updateLoadingState(s, 'loading') }));
    try {
      const data = await asyncFn();
      setState((s) => ({ ...s, ...updateLoadingState(s, 'success'), data }));
      options?.onSuccess?.();
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState((s) => ({ ...s, ...updateLoadingState(s, 'error'), error }));
      options?.onError?.(error);
      throw error;
    }
  }, [asyncFn, options]);

  const reset = useCallback(() => {
    setState(createLoadingState('idle'));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setStatus: (status: AsyncStatus, progress?: number) =>
      setState((s) => ({ ...s, ...updateLoadingState(s, status, progress) })),
  };
}

/**
 * Hook for managing multiple async operations.
 */
export function useMultiAsync() {
  const [states, setStates] = useState<Record<string, LoadingState & { error?: Error }>>({});

  const setStatus = useCallback((key: string, status: AsyncStatus, error?: Error) => {
    setStates((prev) => ({
      ...prev,
      [key]: {
        ...updateLoadingState(prev[key] || createLoadingState(), status),
        error,
      },
    }));
  }, []);

  const execute = useCallback(
    async <T,>(key: string, asyncFn: () => Promise<T>) => {
      setStatus(key, 'loading');
      try {
        const data = await asyncFn();
        setStatus(key, 'success');
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setStatus(key, 'error', error);
        throw error;
      }
    },
    [setStatus],
  );

  const reset = useCallback((key: string) => {
    setStatus(key, 'idle');
  }, [setStatus]);

  return { states, execute, reset, setStatus };
}

/**
 * Hook for debounced async operations.
 */
export function useDebouncedAsync<T>(
  asyncFn: () => Promise<T>,
  delay: number = 500,
) {
  const [state, setState] = useState<LoadingState & { data?: T }>(
    createLoadingState('idle'),
  );
  const timeoutRef = useRef<NodeJS.Timeout>();

  const execute = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState((s) => ({ ...s, ...updateLoadingState(s, 'loading') }));

    timeoutRef.current = setTimeout(async () => {
      try {
        const data = await asyncFn();
        setState((s) => ({ ...s, ...updateLoadingState(s, 'success'), data }));
      } catch (err) {
        setState((s) => ({ ...s, ...updateLoadingState(s, 'error') }));
      }
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [asyncFn, delay]);

  return { ...state, execute };
}

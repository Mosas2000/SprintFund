import { useState, useCallback } from 'react';
import type { LoadingState } from '../lib/loading-state';
import { createLoadingState, updateLoadingState } from '../lib/loading-state';

interface UseRetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number) => void;
  onMaxAttemptsReached?: () => void;
}

export function useRetry<T>(
  fn: () => Promise<T>,
  options: UseRetryOptions = {},
) {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    onRetry,
    onMaxAttemptsReached,
  } = options;

  const [loadingState, setLoadingState] = useState<LoadingState>(createLoadingState('idle'));
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    let lastError: Error | null = null;
    let currentAttempt = 0;

    while (currentAttempt < maxAttempts) {
      try {
        setLoadingState(updateLoadingState(loadingState, 'loading'));
        setError(null);
        currentAttempt++;
        setAttempts(currentAttempt);

        const result = await fn();
        setData(result);
        setLoadingState(updateLoadingState(loadingState, 'success'));
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        setError(lastError);

        if (currentAttempt < maxAttempts) {
          onRetry?.(currentAttempt);
          const delay = delayMs * Math.pow(backoffMultiplier, currentAttempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    onMaxAttemptsReached?.();
    setLoadingState(updateLoadingState(loadingState, 'error'));
    setError(lastError);
    throw lastError;
  }, [fn, maxAttempts, delayMs, backoffMultiplier, onRetry, onMaxAttemptsReached, loadingState]);

  const reset = useCallback(() => {
    setLoadingState(createLoadingState('idle'));
    setAttempts(0);
    setError(null);
    setData(null);
  }, []);

  return {
    ...loadingState,
    error,
    data,
    attempts,
    execute,
    reset,
  };
}

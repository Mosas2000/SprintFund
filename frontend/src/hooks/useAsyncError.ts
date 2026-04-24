import { useState, useCallback } from 'react';
import { normalizeError } from '../lib/error-normalizer';
import type { NormalizedError } from '../lib/error-normalizer';

export const useAsyncError = () => {
  const [error, setError] = useState<NormalizedError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fn();
        return result;
      } catch (err) {
        setError(normalizeError(err));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const retry = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      setError(null);
      return execute(fn);
    },
    [execute],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, isLoading, execute, retry, clearError };
};

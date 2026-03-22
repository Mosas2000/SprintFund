import { useState, useCallback } from 'react';
import { AsyncError } from '../lib/async-errors';

export const useAsyncError = () => {
  const [error, setError] = useState<AsyncError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fn();
        return result;
      } catch (err) {
        if (err instanceof AsyncError) {
          setError(err);
        } else {
          setError(
            new AsyncError(
              err instanceof Error ? err.message : 'An error occurred',
              'UNKNOWN',
            ),
          );
        }
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

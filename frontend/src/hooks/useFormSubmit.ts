import { useState, useCallback } from 'react';
import type { LoadingState } from '../lib/loading-state';
import { createLoadingState, updateLoadingState } from '../lib/loading-state';

interface UseFormOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useFormSubmit<T>(
  submitFn: () => Promise<T>,
  options?: UseFormOptions<T>,
) {
  const [loadingState, setLoadingState] = useState<LoadingState>(createLoadingState('idle'));
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const submit = useCallback(async () => {
    try {
      setLoadingState(updateLoadingState(loadingState, 'loading'));
      setError(null);

      const result = await submitFn();
      setData(result);
      setLoadingState(updateLoadingState(loadingState, 'success'));
      options?.onSuccess?.(result);

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setLoadingState(updateLoadingState(loadingState, 'error'));
      options?.onError?.(error);

      throw error;
    }
  }, [submitFn, loadingState, options]);

  const reset = useCallback(() => {
    setLoadingState(createLoadingState('idle'));
    setError(null);
    setData(null);
  }, []);

  return {
    ...loadingState,
    error,
    data,
    submit,
    reset,
  };
}

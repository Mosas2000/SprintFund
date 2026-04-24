import { useState, useCallback } from 'react';
import type { LoadingState } from '../lib/loading-state';
import { createLoadingState, updateLoadingState } from '../lib/loading-state';
import { normalizeError } from '../lib/error-normalizer';
import type { NormalizedError } from '../lib/error-normalizer';

interface UseFormOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: NormalizedError) => void;
}

export function useFormSubmit<T>(
  submitFn: () => Promise<T>,
  options?: UseFormOptions<T>,
) {
  const [loadingState, setLoadingState] = useState<LoadingState>(createLoadingState('idle'));
  const [error, setError] = useState<NormalizedError | null>(null);
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
      const normalized = normalizeError(err);
      setError(normalized);
      setLoadingState(updateLoadingState(loadingState, 'error'));
      options?.onError?.(normalized);

      throw err;
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

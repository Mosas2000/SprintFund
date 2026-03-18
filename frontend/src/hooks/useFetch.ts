import { useState, useCallback, useRef } from 'react';
import type { LoadingState } from '../lib/loading-state';
import { createLoadingState, updateLoadingState } from '../lib/loading-state';

interface UseFetchOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options?: UseFetchOptions<T>,
) {
  const [loadingState, setLoadingState] = useState<LoadingState>(createLoadingState('idle'));
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async () => {
    try {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setLoadingState(updateLoadingState(loadingState, 'loading'));
      setError(null);

      const result = await fetchFn();
      setData(result);
      setLoadingState(updateLoadingState(loadingState, 'success'));
      options?.onSuccess?.(result);

      return result;
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        const error = err;
        setError(error);
        setLoadingState(updateLoadingState(loadingState, 'error'));
        options?.onError?.(error);
      }
      throw err;
    }
  }, [fetchFn, loadingState, options]);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return {
    ...loadingState,
    data,
    error,
    fetch,
    cancel,
  };
}

import { useState, useCallback, useRef } from 'react';
import type { LoadingState } from '../lib/loading-state';
import { createLoadingState, updateLoadingState } from '../lib/loading-state';
import { normalizeError } from '../lib/error-normalizer';
import type { NormalizedError } from '../lib/error-normalizer';

interface UseRefreshOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: NormalizedError) => void;
}

/**
 * Hook for managing data refresh operations.
 */
export function useRefresh<T>(
  fetchFn: () => Promise<T>,
  options?: UseRefreshOptions<T>,
) {
  const [loadingState, setLoadingState] = useState<LoadingState>(createLoadingState('idle'));
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<NormalizedError | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
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
      if (err instanceof Error && err.name === 'AbortError') {
        throw err;
      }
      
      const normalized = normalizeError(err);
      setError(normalized);
      setLoadingState(updateLoadingState(loadingState, 'error'));
      options?.onError?.(normalized);
      
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
    refresh,
    cancel,
  };
}

/**
 * Hook for polling/refetching data at intervals.
 */
export function usePoll<T>(
  fetchFn: () => Promise<T>,
  interval: number = 30000,
  options?: UseRefreshOptions<T>,
) {
  const [loadingState, setLoadingState] = useState<LoadingState>(createLoadingState('idle'));
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<NormalizedError | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const startPolling = useCallback(() => {
    if (isPolling) return;
    setIsPolling(true);

    const poll = async () => {
      try {
        setLoadingState(updateLoadingState(loadingState, 'loading'));
        const result = await fetchFn();
        setData(result);
        setLoadingState(updateLoadingState(loadingState, 'success'));
        options?.onSuccess?.(result);
      } catch (err) {
        const normalized = normalizeError(err);
        setError(normalized);
        setLoadingState(updateLoadingState(loadingState, 'error'));
        options?.onError?.(normalized);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, interval);
  }, [fetchFn, interval, loadingState, options, isPolling]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  return {
    ...loadingState,
    data,
    error,
    isPolling,
    startPolling,
    stopPolling,
  };
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { normalizeError } from '../lib/error-normalizer';
import type { NormalizedError } from '../lib/error-normalizer';

interface UseStaleWhileRevalidateOptions<T> {
  staleTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: NormalizedError) => void;
}

interface UseStaleWhileRevalidateState<T> {
  data: T | null;
  isLoading: boolean;
  isStale: boolean;
  error: NormalizedError | null;
}

export function useStaleWhileRevalidate<T>(
  fetchFn: () => Promise<T>,
  options: UseStaleWhileRevalidateOptions<T> = {},
): UseStaleWhileRevalidateState<T> & { revalidate: () => void } {
  const { staleTime = 10 * 60 * 1000, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const dataTimestampRef = useRef<number | null>(null);
  const revalidatePromiseRef = useRef<Promise<T> | null>(null);

  const isCacheStale = useCallback(() => {
    if (dataTimestampRef.current === null) return true;
    return Date.now() - dataTimestampRef.current > staleTime;
  }, [staleTime]);

  const revalidate = useCallback(async () => {
    if (revalidatePromiseRef.current) {
      return revalidatePromiseRef.current;
    }

    setIsLoading(true);
    setError(null);

    revalidatePromiseRef.current = fetchFn()
      .then((result) => {
        setData(result);
        setIsStale(false);
        dataTimestampRef.current = Date.now();
        onSuccess?.(result);
        return result;
      })
      .catch((err) => {
        const normalized = normalizeError(err);
        setError(normalized);
        onError?.(normalized);
        throw err;
      })
      .finally(() => {
        setIsLoading(false);
        revalidatePromiseRef.current = null;
      });

    return revalidatePromiseRef.current;
  }, [fetchFn, onSuccess, onError]);

  useEffect(() => {
    if (data === null) {
      revalidate();
    } else if (isCacheStale()) {
      setIsStale(true);
      revalidate();
    }
  }, [data, isCacheStale, revalidate]);

  return {
    data,
    isLoading,
    isStale,
    error,
    revalidate,
  };
}

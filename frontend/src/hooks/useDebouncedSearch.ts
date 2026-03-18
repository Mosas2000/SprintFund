import { useState, useEffect, useRef, useCallback } from 'react';
import type { LoadingState } from '../lib/loading-state';
import { createLoadingState, updateLoadingState } from '../lib/loading-state';

interface UseDebouncedSearchOptions<T> {
  delay?: number;
  onSuccess?: (results: T[]) => void;
  onError?: (error: Error) => void;
  minChars?: number;
}

export function useDebouncedSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  options: UseDebouncedSearchOptions<T> = {},
) {
  const { delay = 500, onSuccess, onError, minChars = 1 } = options;

  const [query, setQuery] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(createLoadingState('idle'));
  const [results, setResults] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(
    async (q: string) => {
      if (!q.trim() || q.length < minChars) {
        setResults([]);
        setLoadingState(createLoadingState('idle'));
        return;
      }

      try {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setLoadingState(updateLoadingState(loadingState, 'loading'));
        setError(null);

        const searchResults = await searchFn(q);
        setResults(searchResults);
        setLoadingState(updateLoadingState(loadingState, 'success'));
        onSuccess?.(searchResults);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          const error = err;
          setError(error);
          setLoadingState(updateLoadingState(loadingState, 'error'));
          onError?.(error);
        }
      }
    },
    [searchFn, minChars, onSuccess, onError, loadingState]
  );

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, delay);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [query, delay, performSearch]);

  const cancel = useCallback(() => {
    clearTimeout(timeoutRef.current);
    abortControllerRef.current?.abort();
    setLoadingState(createLoadingState('idle'));
  }, []);

  return {
    ...loadingState,
    query,
    setQuery,
    results,
    error,
    cancel,
  };
}

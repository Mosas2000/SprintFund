import { useCallback, useState } from 'react';

/** Generic pagination cache entry with typed data */
interface PaginationCacheEntry<T> {
  data: T[];
  timestamp: number;
}

/** Filter parameters for cache key generation */
interface FilterParams {
  status?: string;
  category?: string;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

const CACHE_DURATION = 5 * 60 * 1000;

export const usePaginationCache = <T = unknown>() => {
  const [cache, setCache] = useState<Map<string, PaginationCacheEntry<T>>>(new Map());

  const getCacheKey = useCallback(
    (page: number, pageSize: number, filters?: FilterParams) => {
      return `page_${page}_size_${pageSize}_filters_${JSON.stringify(filters || {})}`;
    },
    []
  );

  const get = useCallback(
    (page: number, pageSize: number, filters?: FilterParams): T[] | null => {
      const key = getCacheKey(page, pageSize, filters);
      const entry = cache.get(key);

      if (!entry) return null;

      const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
      if (isExpired) {
        const newCache = new Map(cache);
        newCache.delete(key);
        setCache(newCache);
        return null;
      }

      return entry.data;
    },
    [cache, getCacheKey]
  );

  const set = useCallback(
    (page: number, pageSize: number, data: T[], filters?: FilterParams) => {
      const key = getCacheKey(page, pageSize, filters);
      const newCache = new Map(cache);
      newCache.set(key, {
        data,
        timestamp: Date.now(),
      });
      setCache(newCache);
    },
    [cache, getCacheKey]
  );

  const clear = useCallback(() => {
    setCache(new Map());
  }, []);

  return { get, set, clear };
};

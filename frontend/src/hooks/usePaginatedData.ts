import { useCallback, useEffect, useState } from 'react';
import { usePaginationStore } from '@/store/pagination';
import { PaginatedResponse } from '@/types/pagination';

interface UsePaginatedDataOptions {
  initialPage?: number;
  initialPageSize?: number;
  fetchFn: (page: number, pageSize: number) => Promise<any[]>;
}

export function usePaginatedData({
  initialPage = 1,
  initialPageSize = 15,
  fetchFn,
}: UsePaginatedDataOptions) {
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    setPaginationState,
  } = usePaginationStore();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (page === initialPage && pageSize === initialPageSize) {
      setPaginationState({
        page: initialPage,
        pageSize: initialPageSize,
      });
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await fetchFn(page, pageSize);
      setData(items);

      const totalPages = Math.ceil(items.length / pageSize);
      setPaginationState({
        page,
        pageSize,
        total: items.length,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, fetchFn, setPaginationState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    refetch: fetchData,
  };
}

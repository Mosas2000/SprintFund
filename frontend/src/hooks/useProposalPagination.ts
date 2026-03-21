import { useCallback, useEffect, useState } from 'react';
import { usePaginationStore } from '@/store/pagination';
import { ProposalPaginationService, ProposalFilterOptions, ProposalSortOptions } from '@/services/proposal-pagination';

interface UseProposalPaginationOptions {
  initialPageSize?: number;
  filters?: ProposalFilterOptions;
  sort?: ProposalSortOptions;
}

export function useProposalPagination({
  initialPageSize = 15,
  filters = {},
  sort = { sortBy: 'createdAt', sortOrder: 'desc' },
}: UseProposalPaginationOptions = {}) {
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    setTotalItems,
    totalPages,
    totalItems,
  } = usePaginationStore();

  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await ProposalPaginationService.fetchPaginatedProposals(
        page,
        pageSize,
        filters,
        sort
      );

      setProposals(result.data || []);
      setTotalItems(result.total || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch proposals';
      setError(message);
      setProposals([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters, sort, setTotalItems]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  return {
    proposals,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    totalItems,
    setPage,
    setPageSize,
    refetch: fetchProposals,
  };
}

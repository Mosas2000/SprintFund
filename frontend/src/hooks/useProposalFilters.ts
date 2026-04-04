import { useState } from 'react';
import type { ProposalSortOptions } from '@/services/proposal-pagination';

/**
 * Filter state for proposal queries.
 * All fields are optional to allow partial filtering.
 */
interface FilterState {
  status?: string;
  proposer?: string;
  category?: string;
  fundingRange?: { min: number; max: number };
  searchText?: string;
}

/** Filter value types mapped by key */
type FilterValue<K extends keyof FilterState> = FilterState[K];

/**
 * Hook for managing proposal filter and sort state.
 * Provides state management and query parameter building for proposal lists.
 * 
 * @example
 * ```tsx
 * const { filters, sort, updateFilter, updateSort } = useProposalFilters();
 * 
 * // Update a filter
 * updateFilter('category', 'infrastructure');
 * 
 * // Update sort
 * updateSort('createdAt', 'desc');
 * ```
 */
export const useProposalFilters = () => {
  const [filters, setFilters] = useState<FilterState>({});
  const [sort, setSort] = useState<ProposalSortOptions>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterValue<K>) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const updateSort = (sortBy: ProposalSortOptions['sortBy'], sortOrder: 'asc' | 'desc') => {
    setSort({ sortBy, sortOrder });
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.proposer) params.append('proposer', filters.proposer);
    if (filters.category) params.append('category', filters.category);
    if (filters.searchText) params.append('search', filters.searchText);
    if (filters.fundingRange) {
      params.append('minFunding', filters.fundingRange.min.toString());
      params.append('maxFunding', filters.fundingRange.max.toString());
    }

    params.append('sortBy', sort.sortBy);
    params.append('sortOrder', sort.sortOrder);

    return params;
  };

  return {
    filters,
    sort,
    updateFilter,
    clearFilters,
    updateSort,
    buildQueryParams,
  };
};

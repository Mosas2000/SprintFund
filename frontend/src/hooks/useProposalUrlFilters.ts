import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  parseSearchParams,
  serializeParams,
  DEFAULT_PARAMS,
  countActiveFilters,
  isDefaultParams,
} from '../lib/proposal-params';
import type {
  ProposalFilterParams,
  StatusFilter,
  CategoryFilter,
  SortOption,
} from '../lib/proposal-params';

export interface UseProposalUrlFiltersReturn {
  params: ProposalFilterParams;
  setStatus: (status: StatusFilter) => void;
  setCategory: (category: CategoryFilter) => void;
  setSort: (sort: SortOption) => void;
  setSearch: (q: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  activeFilterCount: number;
  hasActiveFilters: boolean;
}

export function useProposalUrlFilters(): UseProposalUrlFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams],
  );

  const update = useCallback(
    (patch: Partial<ProposalFilterParams>) => {
      const next = serializeParams({ ...params, ...patch });
      setSearchParams(next, { replace: true });
    },
    [params, setSearchParams],
  );

  const setStatus = useCallback(
    (status: StatusFilter) => update({ status, page: 1 }),
    [update],
  );

  const setCategory = useCallback(
    (category: CategoryFilter) => update({ category, page: 1 }),
    [update],
  );

  const setSort = useCallback(
    (sort: SortOption) => update({ sort, page: 1 }),
    [update],
  );

  const setSearch = useCallback(
    (q: string) => update({ q, page: 1 }),
    [update],
  );

  const setPage = useCallback(
    (page: number) => update({ page }),
    [update],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const activeFilterCount = useMemo(
    () => countActiveFilters(params),
    [params],
  );

  const hasActiveFilters = useMemo(
    () => !isDefaultParams(params),
    [params],
  );

  return {
    params,
    setStatus,
    setCategory,
    setSort,
    setSearch,
    setPage,
    resetFilters,
    activeFilterCount,
    hasActiveFilters,
  };
}

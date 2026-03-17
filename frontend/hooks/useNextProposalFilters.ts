'use client';

import { useCallback, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  parseSearchParams,
  serializeParams,
  countActiveFilters,
  isDefaultParams,
} from '../lib/proposal-params';
import type {
  ProposalFilterParams,
  StatusFilter,
  CategoryFilter,
  SortOption,
} from '../lib/proposal-params';

export interface UseNextProposalFiltersReturn {
  params: ProposalFilterParams;
  setStatus: (status: StatusFilter) => void;
  setCategory: (category: CategoryFilter) => void;
  setSort: (sort: SortOption) => void;
  setSearch: (q: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  activeFilterCount: number;
  hasActiveFilters: boolean;
  isPending: boolean;
}

export function useNextProposalFilters(): UseNextProposalFiltersReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const params = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams],
  );

  const navigate = useCallback(
    (patch: Partial<ProposalFilterParams>) => {
      const next = serializeParams({ ...params, ...patch });
      const qs = next.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [params, pathname, router],
  );

  const setStatus = useCallback(
    (status: StatusFilter) => navigate({ status, page: 1 }),
    [navigate],
  );

  const setCategory = useCallback(
    (category: CategoryFilter) => navigate({ category, page: 1 }),
    [navigate],
  );

  const setSort = useCallback(
    (sort: SortOption) => navigate({ sort, page: 1 }),
    [navigate],
  );

  const setSearch = useCallback(
    (q: string) => navigate({ q, page: 1 }),
    [navigate],
  );

  const setPage = useCallback(
    (page: number) => navigate({ page }),
    [navigate],
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [router, pathname]);

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
    isPending,
  };
}

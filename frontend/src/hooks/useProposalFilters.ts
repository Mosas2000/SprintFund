interface FilterState {
  status?: string;
  proposer?: string;
  category?: string;
  fundingRange?: { min: number; max: number };
  searchText?: string;
}

interface SortState {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const useProposalFilters = () => {
  const [filters, setFilters] = React.useState<FilterState>({});
  const [sort, setSort] = React.useState<SortState>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const updateSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
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

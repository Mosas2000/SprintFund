export type StatusFilter = 'all' | 'active' | 'executed';
export type CategoryFilter =
  | 'all'
  | 'development'
  | 'design'
  | 'marketing'
  | 'community'
  | 'research'
  | 'other';
export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'most-votes' | 'ending-soon';

export interface ProposalFilterParams {
  status: StatusFilter;
  category: CategoryFilter;
  sort: SortOption;
  q: string;
  page: number;
  pageSize: number;
}

export interface SearchParamsLike {
  get(name: string): string | null;
}

export const DEFAULT_PARAMS: ProposalFilterParams = {
  status: 'all',
  category: 'all',
  sort: 'newest',
  q: '',
  page: 1,
  pageSize: 10,
};

const VALID_STATUSES = new Set<StatusFilter>(['all', 'active', 'executed']);
const VALID_CATEGORIES = new Set<CategoryFilter>([
  'all',
  'development',
  'design',
  'marketing',
  'community',
  'research',
  'other',
]);
const VALID_SORTS = new Set<SortOption>([
  'newest',
  'oldest',
  'highest',
  'lowest',
  'most-votes',
  'ending-soon',
]);

export function parseStatus(value: string | null): StatusFilter {
  if (value && VALID_STATUSES.has(value as StatusFilter)) {
    return value as StatusFilter;
  }
  return DEFAULT_PARAMS.status;
}

export function parseCategory(value: string | null): CategoryFilter {
  if (value && VALID_CATEGORIES.has(value as CategoryFilter)) {
    return value as CategoryFilter;
  }
  return DEFAULT_PARAMS.category;
}

export function parseSort(value: string | null): SortOption {
  if (value && VALID_SORTS.has(value as SortOption)) {
    return value as SortOption;
  }
  return DEFAULT_PARAMS.sort;
}

export function parsePage(value: string | null): number {
  const n = parseInt(value ?? '', 10);
  return isNaN(n) || n < 1 ? 1 : n;
}

const VALID_PAGE_SIZES = new Set<number>([10, 15, 20, 25, 50]);

export function parsePageSize(value: string | null): number {
  const n = parseInt(value ?? '', 10);
  if (!isNaN(n) && VALID_PAGE_SIZES.has(n)) {
    return n;
  }
  return DEFAULT_PARAMS.pageSize;
}

export function parseSearchParams(params: SearchParamsLike): ProposalFilterParams {
  return {
    status: parseStatus(params.get('status')),
    category: parseCategory(params.get('category')),
    sort: parseSort(params.get('sort')),
    q: params.get('q') ?? '',
    page: parsePage(params.get('page')),
    pageSize: parsePageSize(params.get('pageSize')),
  };
}

export function serializeParams(params: Partial<ProposalFilterParams>): URLSearchParams {
  const merged: ProposalFilterParams = { ...DEFAULT_PARAMS, ...params };
  const out = new URLSearchParams();

  if (merged.status !== DEFAULT_PARAMS.status) out.set('status', merged.status);
  if (merged.category !== DEFAULT_PARAMS.category) out.set('category', merged.category);
  if (merged.sort !== DEFAULT_PARAMS.sort) out.set('sort', merged.sort);
  if (merged.q.trim()) out.set('q', merged.q.trim());
  if (merged.page > 1) out.set('page', String(merged.page));
  if (merged.pageSize !== DEFAULT_PARAMS.pageSize) out.set('pageSize', String(merged.pageSize));

  return out;
}

export function buildProposalUrl(
  base: string,
  params: Partial<ProposalFilterParams>,
): string {
  const qs = serializeParams(params).toString();
  return qs ? `${base}?${qs}` : base;
}

export function countActiveFilters(params: ProposalFilterParams): number {
  let count = 0;
  if (params.status !== DEFAULT_PARAMS.status) count++;
  if (params.category !== DEFAULT_PARAMS.category) count++;
  if (params.sort !== DEFAULT_PARAMS.sort) count++;
  if (params.q.trim()) count++;
  return count;
}

export function isDefaultParams(params: ProposalFilterParams): boolean {
  return (
    params.status === DEFAULT_PARAMS.status &&
    params.category === DEFAULT_PARAMS.category &&
    params.sort === DEFAULT_PARAMS.sort &&
    params.q.trim() === '' &&
    params.page === 1
  );
}

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 15,
  MIN_PAGE_SIZE: 5,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 15, 20, 25, 50],
  MAX_VISIBLE_PAGES: 5,
  CACHE_DURATION_MS: 5 * 60 * 1000,
  STORAGE_KEY: 'pagination_state',
  INITIAL_PAGE: 1,
} as const;

export const SORT_OPTIONS = {
  CREATED_AT: 'createdAt',
  TITLE: 'title',
  AMOUNT: 'requestedAmount',
  VOTES: 'votes',
} as const;

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const PROPOSAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];
export type SortOrder = typeof SORT_ORDERS[keyof typeof SORT_ORDERS];
export type ProposalStatus = typeof PROPOSAL_STATUS[keyof typeof PROPOSAL_STATUS];

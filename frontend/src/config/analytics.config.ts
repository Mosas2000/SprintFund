export const ANALYTICS_CONFIG = {
  DATA_REFRESH_INTERVAL: 60000,
  API_CACHE_TTL: 300,
  CHART_ANIMATION_DURATION: 500,
  MAX_HISTORICAL_DAYS: 365,
  TOP_STAKERS_COUNT: 10,
  WHALE_CONCENTRATION_THRESHOLD: 50,
  PAGINATION_SIZE: 20,
  MAX_EXPORT_ROWS: 10000,
  PERFORMANCE_SAMPLE_SIZE: 100,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  COLORS: {
    primary: '#8b5cf6',
    secondary: '#ec4899',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    neutral: '#a78bfa',
  },
  CHART_DEFAULTS: {
    margin: { top: 5, right: 30, left: 0, bottom: 5 },
    height: 300,
    animationDuration: 500,
  },
  TIME_RANGES: {
    WEEK: 7,
    MONTH: 30,
    QUARTER: 90,
    YEAR: 365,
  },
  METRICS: {
    MIN_PROPOSAL_COUNT: 1,
    MIN_VOTER_COUNT: 1,
    MIN_SUCCESS_RATE: 0,
    MAX_PENDING_RATE: 100,
  },
} as const;

export const ANALYTICS_MESSAGES = {
  LOADING: 'Loading analytics data...',
  ERROR: 'An error occurred while loading analytics',
  NO_DATA: 'No data available for the selected range',
  REFRESHING: 'Refreshing data...',
  LAST_UPDATED: 'Last updated',
  EXPORT_SUCCESS: 'Data exported successfully',
  EXPORT_ERROR: 'Error exporting data',
  FILTER_APPLIED: 'Filter applied',
  FILTER_CLEARED: 'Filters cleared',
} as const;

export const CHART_COLORS = [
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#f97316',
  '#6366f1',
  '#14b8a6',
  '#8b5cf6',
  '#d946ef',
] as const;

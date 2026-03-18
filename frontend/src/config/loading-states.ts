/**
 * Loading States Configuration
 *
 * Centralized configuration for loading state behavior and defaults.
 */

export const LOADING_STATE_CONFIG = {
  // Debouncing configuration
  debounce: {
    search: 500,
    input: 300,
    filter: 400,
  },

  // Polling configuration
  polling: {
    default: 30000, // 30 seconds
    fast: 5000, // 5 seconds
    slow: 60000, // 1 minute
    proposals: 30000,
    stats: 60000,
  },

  // Retry configuration
  retry: {
    maxAttempts: 3,
    baseDelay: 1000, // milliseconds
    backoffMultiplier: 2,
    maxDelay: 30000, // Maximum wait between retries
  },

  // Loading state display
  display: {
    spinnerSize: {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    },
    skeletonAnimationDuration: 1500, // milliseconds
  },

  // Timeout configuration
  timeout: {
    default: 30000, // 30 seconds
    api: 15000, // 15 seconds
    blockchain: 60000, // 60 seconds
    form: 45000, // 45 seconds
  },

  // Toast configuration
  toast: {
    duration: 3000, // milliseconds
    position: 'bottom-right' as const,
  },

  // Animation configuration
  animation: {
    transitionDuration: 300, // milliseconds
    staggerDelay: 100, // milliseconds between staggered animations
  },
} as const;

export const LOADING_TEXTS = {
  default: 'Loading...',
  connecting: 'Connecting wallet...',
  submitting: 'Submitting...',
  executing: 'Executing transaction...',
  voting: 'Submitting vote...',
  creating: 'Creating proposal...',
  fetching: 'Fetching data...',
  processing: 'Processing...',
  saving: 'Saving...',
  updating: 'Updating...',
} as const;

export const ERROR_MESSAGES = {
  generic: 'An error occurred. Please try again.',
  network: 'Network error. Please check your connection.',
  timeout: 'Request timed out. Please try again.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  blockchain: 'Blockchain transaction failed. Please try again.',
  wallet: 'Wallet connection failed. Please try again.',
  insufficient: 'Insufficient balance for this operation.',
  cancelled: 'Operation was cancelled by the user.',
} as const;

export const SUCCESS_MESSAGES = {
  default: 'Operation completed successfully!',
  created: 'Created successfully!',
  updated: 'Updated successfully!',
  deleted: 'Deleted successfully!',
  submitted: 'Submitted successfully!',
  connected: 'Wallet connected successfully!',
  voted: 'Vote submitted successfully!',
  proposed: 'Proposal created successfully!',
  executed: 'Proposal executed successfully!',
} as const;

export type LoadingStateConfig = typeof LOADING_STATE_CONFIG;
export type LoadingTexts = typeof LOADING_TEXTS;
export type ErrorMessages = typeof ERROR_MESSAGES;
export type SuccessMessages = typeof SUCCESS_MESSAGES;

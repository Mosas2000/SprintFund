/**
 * Loading state types and utilities.
 */

/**
 * Async operation status.
 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Loading state for an async operation.
 */
export interface LoadingState {
  status: AsyncStatus;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  progress?: number;
}

/**
 * Create initial loading state.
 */
export function createLoadingState(status: AsyncStatus = 'idle'): LoadingState {
  return {
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

/**
 * Update loading state with new status.
 */
export function updateLoadingState(
  current: LoadingState,
  status: AsyncStatus,
  progress?: number,
): LoadingState {
  return {
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    progress,
  };
}

/**
 * Named loading states for common operations.
 */
export interface MultiLoadingState {
  wallet: LoadingState;
  proposals: LoadingState;
  voting: LoadingState;
  staking: LoadingState;
  execution: LoadingState;
  refresh: LoadingState;
}

/**
 * Create initial multi-loading state.
 */
export function createMultiLoadingState(): MultiLoadingState {
  return {
    wallet: createLoadingState(),
    proposals: createLoadingState(),
    voting: createLoadingState(),
    staking: createLoadingState(),
    execution: createLoadingState(),
    refresh: createLoadingState(),
  };
}

/**
 * Check if any operation is loading.
 */
export function isAnyLoading(state: MultiLoadingState): boolean {
  return Object.values(state).some((s) => s.isLoading);
}

/**
 * Check if any operation has error.
 */
export function hasError(state: MultiLoadingState): boolean {
  return Object.values(state).some((s) => s.isError);
}

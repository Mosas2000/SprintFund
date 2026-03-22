import { AsyncError, ErrorCode } from '../lib/async-errors';

export interface ErrorContext {
  endpoint?: string;
  functionName?: string;
  userId?: string;
  timestamp: number;
}

export interface ErrorEvent {
  error: AsyncError;
  context: ErrorContext;
  attempt?: number;
  willRetry?: boolean;
}

export interface AsyncOperationResult<T> {
  data: T | null;
  error: AsyncError | null;
  isLoading: boolean;
  isRetrying: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface ErrorRecoveryConfig {
  strategies: Map<ErrorCode, RecoveryStrategy>;
  retryQueue: Array<() => Promise<void>>;
}

export interface RecoveryStrategy {
  name: string;
  apply: () => Promise<void>;
  shouldApply?: (error: AsyncError) => boolean;
}

export interface ErrorMetrics {
  errorCount: number;
  retryCount: number;
  successAfterRetry: number;
  lastError?: AsyncError;
  lastErrorTime?: number;
}

export interface ApiCallOptions {
  retries?: number;
  timeout?: number;
  cache?: boolean;
  cacheTTL?: number;
}

export interface ContractCallOptions extends ApiCallOptions {
  functionName: string;
  validate?: (data: unknown) => boolean;
}

export type ErrorHandler = (error: AsyncError) => void;
export type RetryHandler = (attempt: number, error: AsyncError) => void;
export type SuccessHandler<T> = (data: T) => void;

import { AsyncError, ErrorCode, isRetryableError } from '../lib/async-errors';

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: AsyncError) => void;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let lastError: AsyncError | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (!(err instanceof AsyncError)) {
        throw new AsyncError(
          err instanceof Error ? err.message : String(err),
          ErrorCode.UNKNOWN,
        );
      }

      lastError = err;

      if (!isRetryableError(err)) {
        throw err;
      }

      if (attempt < maxRetries) {
        const delay = Math.min(
          baseDelay * Math.pow(backoffMultiplier, attempt - 1),
          maxDelay,
        );
        const jitter = Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));

        onRetry?.(attempt, err);
      }
    }
  }

  throw (
    lastError ||
    new AsyncError('Max retries exceeded', ErrorCode.UNKNOWN)
  );
}

export interface CacheOptions {
  ttl?: number;
  key?: string;
}

const cache = new Map<string, { value: unknown; timestamp: number }>();

export function generateCacheKey(...parts: (string | number)[]): string {
  return parts.join(':');
}

export async function withCache<T>(
  fn: () => Promise<T>,
  options: CacheOptions = {},
): Promise<T> {
  const { ttl = 5 * 60 * 1000, key } = options;

  if (key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value as T;
    }
  }

  const result = await fn();

  if (key) {
    cache.set(key, { value: result, timestamp: Date.now() });
  }

  return result;
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

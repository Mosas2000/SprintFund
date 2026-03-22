import { AsyncError, ErrorCode, getErrorCode } from './async-errors';

export async function fetchWithErrorHandling(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const code = getErrorCode(response.status);
      throw new AsyncError(
        `HTTP ${response.status}: ${response.statusText}`,
        code,
        response.status,
      );
    }

    return response;
  } catch (err) {
    if (err instanceof AsyncError) {
      throw err;
    }

    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      throw new AsyncError('Network request failed', ErrorCode.NETWORK_ERROR, undefined, err);
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new AsyncError('Request timeout', ErrorCode.TIMEOUT_ERROR, 408, err);
    }

    throw new AsyncError('Unknown fetch error', ErrorCode.UNKNOWN, undefined, err);
  }
}

export async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new AsyncError('Max retries exceeded', ErrorCode.UNKNOWN);
}

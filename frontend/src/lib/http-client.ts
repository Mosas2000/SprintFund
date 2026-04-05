/**
 * Type-safe HTTP request utilities.
 */

import type { Result } from './type-helpers';
import { error, success } from './type-helpers';

/**
 * HTTP request configuration.
 */
export interface HttpRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
}

/**
 * HTTP response wrapper.
 */
export interface HttpResponse<T> {
  status: number;
  statusText: string;
  data: T;
  headers: Record<string, string>;
}

/**
 * Type-safe HTTP client.
 */
export async function httpGet<T>(
  url: string,
  config?: HttpRequestConfig,
): Promise<Result<T>> {
  return httpRequest<T>(url, { ...config, method: 'GET' });
}

/**
 * Type-safe POST request.
 */
export async function httpPost<T>(
  url: string,
  data: unknown,
  config?: HttpRequestConfig,
): Promise<Result<T>> {
  return httpRequest<T>(url, {
    ...config,
    method: 'POST',
    body: data,
  });
}

/**
 * Generic type-safe HTTP request.
 */
export async function httpRequest<T>(
  url: string,
  config: HttpRequestConfig = {},
): Promise<Result<T>> {
  const { method = 'GET', headers = {}, body, timeout = 30000 } = config;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    clearTimeout(timeoutId);

    if (!response.ok) {
      return error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return success(data);
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        return error('Request timeout');
      }
      return error(`Request failed: ${err.message}}`);
    }
    return error('Unknown request error');
  }
}

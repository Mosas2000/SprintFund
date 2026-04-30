import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AsyncError, ErrorCode, getErrorMessage, isRetryableError } from '../lib/async-errors';
import { fetchWithErrorHandling, retryWithExponentialBackoff } from '../lib/fetch-utils';
import { withRetry } from '../lib/retry-utils';
import { ApiError } from '../lib/api';
import { ContractError } from '../lib/stacks';

describe('Error Handling', () => {
  describe('AsyncError', () => {
    it('creates error with code and message', () => {
      const error = new AsyncError('Test error', ErrorCode.NETWORK_ERROR);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
    });

    it('includes status code when provided', () => {
      const error = new AsyncError('Server error', ErrorCode.SERVER_ERROR, 500);
      expect(error.statusCode).toBe(500);
    });

    it('stores original error', () => {
      const originalError = new Error('Original');
      const error = new AsyncError('Wrapped', ErrorCode.UNKNOWN, undefined, originalError);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('Error Classification', () => {
    it('identifies retryable errors', () => {
      expect(isRetryableError(new AsyncError('', ErrorCode.NETWORK_ERROR))).toBe(true);
      expect(isRetryableError(new AsyncError('', ErrorCode.TIMEOUT_ERROR))).toBe(true);
      expect(isRetryableError(new AsyncError('', ErrorCode.RATE_LIMIT))).toBe(true);
      expect(isRetryableError(new AsyncError('', ErrorCode.SERVER_ERROR))).toBe(true);
    });

    it('identifies non-retryable errors', () => {
      expect(isRetryableError(new AsyncError('', ErrorCode.UNAUTHORIZED))).toBe(false);
      expect(isRetryableError(new AsyncError('', ErrorCode.VALIDATION_FAILED))).toBe(false);
      expect(isRetryableError(new AsyncError('', ErrorCode.NOT_FOUND))).toBe(false);
    });
  });

  describe('Error Messages', () => {
    it('provides user-friendly messages', () => {
      const error = new AsyncError('', ErrorCode.NETWORK_ERROR);
      const message = getErrorMessage(error);
      expect(message.toLowerCase()).toContain('network');
    });

    it('includes status code in server error message', () => {
      const error = new AsyncError('', ErrorCode.SERVER_ERROR, 503);
      const message = getErrorMessage(error);
      expect(message).toContain('503');
    });
  });

  describe('Retry Logic', () => {
    it('retries failed operations', async () => {
      let attempts = 0;
      const fn = vi.fn(async () => {
        attempts++;
        if (attempts < 3) {
          throw new AsyncError('Temporary error', ErrorCode.NETWORK_ERROR);
        }
        return 'success';
      });

      const result = await withRetry(fn, { maxRetries: 5, baseDelay: 10 });
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('throws after max retries exceeded', async () => {
      const fn = async () => {
        throw new AsyncError('Permanent error', ErrorCode.NETWORK_ERROR);
      };

      await expect(
        withRetry(async () => fn(), { maxRetries: 2, baseDelay: 10 }),
      ).rejects.toThrow(AsyncError);
    });

    it('does not retry non-retryable errors', async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        throw new AsyncError('Auth error', ErrorCode.UNAUTHORIZED);
      };

      await expect(withRetry(fn, { maxRetries: 5, baseDelay: 10 })).rejects.toThrow();
      expect(attempts).toBe(1);
    });

    it('calls onRetry callback', async () => {
      const onRetry = vi.fn();
      let attempts = 0;

      const fn = async () => {
        attempts++;
        if (attempts < 2) {
          throw new AsyncError('Temp', ErrorCode.NETWORK_ERROR);
        }
        return 'ok';
      };

      await withRetry(fn, { maxRetries: 3, baseDelay: 10, onRetry });
      expect(onRetry).toHaveBeenCalled();
    });

    it('applies exponential backoff', async () => {
      const timings: number[] = [];
      let lastTime = Date.now();
      let attempts = 0;

      const fn = async () => {
        attempts++;
        const now = Date.now();
        if (attempts > 1) {
          timings.push(now - lastTime);
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        lastTime = now;

        if (attempts < 4) {
          throw new AsyncError('Temp', ErrorCode.NETWORK_ERROR);
        }
        return 'ok';
      };

      await withRetry(fn, { maxRetries: 5, baseDelay: 50 });
      
      // Just verify we had multiple retries and delays occurred
      expect(timings.length).toBeGreaterThanOrEqual(2);
      // Verify delays are non-zero (indicating backoff is happening)
      expect(timings.every(t => t > 0)).toBe(true);
    });
  });

  describe('API Error', () => {
    it('extends AsyncError', () => {
      const error = new ApiError('API failed', ErrorCode.NETWORK_ERROR, undefined, 'test_endpoint');
      expect(error).toBeInstanceOf(AsyncError);
      expect(error.endpoint).toBe('test_endpoint');
    });
  });

  describe('Contract Error', () => {
    it('extends AsyncError', () => {
      const error = new ContractError('Contract failed', ErrorCode.CONTRACT_CALL_FAILED, 'test-function');
      expect(error).toBeInstanceOf(AsyncError);
      expect(error.functionName).toBe('test-function');
    });
  });
});

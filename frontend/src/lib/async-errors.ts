export class AsyncError extends Error {
  readonly code: string;
  readonly statusCode?: number;
  readonly originalError?: unknown;

  constructor(message: string, code: string, statusCode?: number, originalError?: unknown) {
    super(message);
    this.name = 'AsyncError';
    this.code = code;
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  RATE_LIMIT = 'RATE_LIMIT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN',
  CONTRACT_CALL_FAILED = 'CONTRACT_CALL_FAILED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

export function getErrorCode(status?: number): ErrorCode {
  if (!status) return ErrorCode.NETWORK_ERROR;
  if (status === 408) return ErrorCode.TIMEOUT_ERROR;
  if (status === 429) return ErrorCode.RATE_LIMIT;
  if (status === 401) return ErrorCode.UNAUTHORIZED;
  if (status === 404) return ErrorCode.NOT_FOUND;
  if (status >= 500) return ErrorCode.SERVER_ERROR;
  return ErrorCode.UNKNOWN;
}

import { normalizeError } from './error-normalizer';

export function getErrorMessage(error: AsyncError): string {
  const normalized = normalizeError(error);
  return normalized.message;
}

export function isRetryableError(error: AsyncError): boolean {
  return ([
    ErrorCode.NETWORK_ERROR,
    ErrorCode.TIMEOUT_ERROR,
    ErrorCode.RATE_LIMIT,
    ErrorCode.SERVER_ERROR,
  ] as string[]).includes(error.code);
}

export function shouldThrowError(error: AsyncError): boolean {
  return ([
    ErrorCode.UNAUTHORIZED,
    ErrorCode.VALIDATION_FAILED,
  ] as string[]).includes(error.code);
}

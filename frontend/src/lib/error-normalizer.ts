import { AsyncError, ErrorCode, isRetryableError } from './async-errors';
import {
  getContractErrorByCode,
  getContractErrorByName,
  isRetryableContractError,
} from './contract-error-map';
import type { ContractErrorEntry } from './contract-error-map';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface NormalizedError {
  message: string;
  suggestion: string;
  severity: ErrorSeverity;
  retryable: boolean;
  rawCode: string;
  rawMessage: string;
  contractCode?: number;
}

const API_ERROR_MESSAGES: Record<string, { message: string; suggestion: string }> = {
  [ErrorCode.NETWORK_ERROR]: {
    message: 'Unable to reach the network.',
    suggestion: 'Check your internet connection and try again.',
  },
  [ErrorCode.TIMEOUT_ERROR]: {
    message: 'The request took too long to complete.',
    suggestion: 'The network may be congested. Try again in a few moments.',
  },
  [ErrorCode.RATE_LIMIT]: {
    message: 'Too many requests were sent in a short time.',
    suggestion: 'Wait a moment before trying again.',
  },
  [ErrorCode.UNAUTHORIZED]: {
    message: 'Your session is not authorized.',
    suggestion: 'Reconnect your wallet and try again.',
  },
  [ErrorCode.NOT_FOUND]: {
    message: 'The requested resource was not found.',
    suggestion: 'The data may have been removed or the address is incorrect.',
  },
  [ErrorCode.SERVER_ERROR]: {
    message: 'The server encountered an internal error.',
    suggestion: 'This is usually temporary. Try again in a few minutes.',
  },
  [ErrorCode.INVALID_RESPONSE]: {
    message: 'The server returned an unexpected response.',
    suggestion: 'Try again. If this persists, the API may be experiencing issues.',
  },
  [ErrorCode.VALIDATION_FAILED]: {
    message: 'The submitted data did not pass validation.',
    suggestion: 'Review your inputs and correct any errors before resubmitting.',
  },
};

function extractContractCodeFromMessage(message: string): number | null {
  const uintMatch = message.match(/\(err\s+u(\d+)\)/);
  if (uintMatch) {
    return parseInt(uintMatch[1], 10);
  }

  const codeMatch = message.match(/error\s+(?:code\s+)?(\d{3})/i);
  if (codeMatch) {
    const code = parseInt(codeMatch[1], 10);
    if (code >= 100 && code <= 999) {
      return code;
    }
  }

  return null;
}

function extractContractNameFromMessage(message: string): string | null {
  const nameMatch = message.match(/ERR-[A-Z]+(?:-[A-Z]+)*/);
  return nameMatch ? nameMatch[0] : null;
}

function severityForApiCode(code: string): ErrorSeverity {
  switch (code) {
    case ErrorCode.NETWORK_ERROR:
    case ErrorCode.TIMEOUT_ERROR:
    case ErrorCode.RATE_LIMIT:
    case ErrorCode.SERVER_ERROR:
      return 'medium';
    case ErrorCode.UNAUTHORIZED:
      return 'high';
    case ErrorCode.NOT_FOUND:
    case ErrorCode.INVALID_RESPONSE:
    case ErrorCode.VALIDATION_FAILED:
      return 'medium';
    default:
      return 'medium';
  }
}

function normalizeFromContractEntry(
  entry: ContractErrorEntry,
  rawMessage: string,
): NormalizedError {
  return {
    message: entry.message,
    suggestion: entry.suggestion,
    severity: entry.severity,
    retryable: entry.retryable,
    rawCode: String(entry.code),
    rawMessage,
    contractCode: entry.code,
  };
}

function normalizeContractError(error: AsyncError): NormalizedError {
  const rawMessage = error.message;

  const numericCode = extractContractCodeFromMessage(rawMessage);
  if (numericCode !== null) {
    const entry = getContractErrorByCode(numericCode);
    if (entry) {
      return normalizeFromContractEntry(entry, rawMessage);
    }
  }

  const errorName = extractContractNameFromMessage(rawMessage);
  if (errorName) {
    const entry = getContractErrorByName(errorName);
    if (entry) {
      return normalizeFromContractEntry(entry, rawMessage);
    }
  }

  return {
    message: 'The contract call did not succeed.',
    suggestion: 'Review the transaction details and try again.',
    severity: 'medium',
    retryable: false,
    rawCode: error.code,
    rawMessage,
  };
}

function normalizeApiError(error: AsyncError): NormalizedError {
  const mapping = API_ERROR_MESSAGES[error.code];
  if (mapping) {
    let { message } = mapping;
    if (error.code === ErrorCode.SERVER_ERROR && error.statusCode) {
      message = `The server returned an error (${error.statusCode}).`;
    }

    return {
      message,
      suggestion: mapping.suggestion,
      severity: severityForApiCode(error.code),
      retryable: isRetryableError(error),
      rawCode: error.code,
      rawMessage: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred.',
    suggestion: 'Try again. If the problem continues, contact support.',
    severity: 'medium',
    retryable: false,
    rawCode: error.code,
    rawMessage: error.message,
  };
}

export function normalizeError(error: unknown): NormalizedError {
  if (error instanceof AsyncError) {
    if (error.code === ErrorCode.CONTRACT_CALL_FAILED) {
      return normalizeContractError(error);
    }
    return normalizeApiError(error);
  }

  if (error instanceof Error) {
    const numericCode = extractContractCodeFromMessage(error.message);
    if (numericCode !== null) {
      const entry = getContractErrorByCode(numericCode);
      if (entry) {
        return normalizeFromContractEntry(entry, error.message);
      }
    }

    const errorName = extractContractNameFromMessage(error.message);
    if (errorName) {
      const entry = getContractErrorByName(errorName);
      if (entry) {
        return normalizeFromContractEntry(entry, error.message);
      }
    }

    return {
      message: error.message || 'An unexpected error occurred.',
      suggestion: 'Try again. If the problem continues, contact support.',
      severity: 'medium',
      retryable: false,
      rawCode: 'UNKNOWN',
      rawMessage: error.message,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      suggestion: 'Try again. If the problem continues, contact support.',
      severity: 'medium',
      retryable: false,
      rawCode: 'UNKNOWN',
      rawMessage: error,
    };
  }

  return {
    message: 'An unexpected error occurred.',
    suggestion: 'Try again. If the problem continues, contact support.',
    severity: 'medium',
    retryable: false,
    rawCode: 'UNKNOWN',
    rawMessage: String(error),
  };
}

export function isNormalizedRetryable(error: unknown): boolean {
  const normalized = normalizeError(error);
  return normalized.retryable;
}

export {
  extractContractCodeFromMessage,
  extractContractNameFromMessage,
};

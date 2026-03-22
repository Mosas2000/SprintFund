import { API_URL } from '../config';
import { encodePathSegment } from './sanitize-url';
import { fetchWithErrorHandling, retryWithExponentialBackoff } from './fetch-utils';
import { AsyncError, ErrorCode } from './async-errors';

export class ApiError extends AsyncError {
  readonly endpoint: string;

  constructor(message: string, code: string, statusCode?: number, endpoint?: string) {
    super(message, code, statusCode);
    this.name = 'ApiError';
    this.endpoint = endpoint || '';
  }
}

async function fetchApiWithRetry<T>(url: string): Promise<T> {
  const response = await retryWithExponentialBackoff(
    () => fetchWithErrorHandling(url),
    3,
    1000,
  );

  try {
    return await response.json();
  } catch {
    throw new AsyncError(
      'Failed to parse API response',
      ErrorCode.INVALID_RESPONSE,
    );
  }
}

export async function getStxBalance(address: string): Promise<number> {
  try {
    const url = `${API_URL}/extended/v1/address/${encodePathSegment(address)}/stx`;
    const data = await fetchApiWithRetry<{ balance: string }>(url);
    return Number(data.balance ?? 0);
  } catch (err) {
    if (err instanceof AsyncError) {
      throw new ApiError(
        err.message,
        err.code,
        err.statusCode,
        'get_stx_balance',
      );
    }
    throw new ApiError(
      'Failed to fetch STX balance',
      ErrorCode.UNKNOWN,
      undefined,
      'get_stx_balance',
    );
  }
}

export async function getTxStatus(txId: string): Promise<string> {
  try {
    const url = `${API_URL}/extended/v1/tx/${encodePathSegment(txId)}`;
    const data = await fetchApiWithRetry<{ tx_status: string }>(url);
    return data.tx_status ?? 'unknown';
  } catch (err) {
    if (err instanceof AsyncError) {
      throw new ApiError(
        err.message,
        err.code,
        err.statusCode,
        'get_tx_status',
      );
    }
    throw new ApiError(
      'Failed to fetch transaction status',
      ErrorCode.UNKNOWN,
      undefined,
      'get_tx_status',
    );
  }
}

export function explorerTxUrl(txId: string): string {
  return `https://explorer.hiro.so/txid/${encodePathSegment(txId)}?chain=mainnet`;
}

export function explorerAddressUrl(address: string): string {
  return `https://explorer.hiro.so/address/${encodePathSegment(address)}?chain=mainnet`;
}

export function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

import { API_URL } from '../config';
import { encodePathSegment } from '../lib/sanitize-url';
import type { WalletBalance } from '../types/balance';

interface StacksBalanceResponse {
  balance: string;
  locked: string;
}

const CACHE_DURATION_MS = 30000;
const balanceCache = new Map<string, { data: WalletBalance; timestamp: number }>();

export async function fetchWalletBalance(address: string): Promise<WalletBalance> {
  const now = Date.now();
  const cached = balanceCache.get(address);

  if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
    return cached.data;
  }

  const url = `${API_URL}/extended/v1/address/${encodePathSegment(address)}/stx`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch balance: ${response.status}`);
  }

  const data: StacksBalanceResponse = await response.json();

  const balance: WalletBalance = {
    stx: Number(data.balance) || 0,
    stxLocked: Number(data.locked) || 0,
  };

  balanceCache.set(address, { data: balance, timestamp: now });

  return balance;
}

export function getCachedBalance(address: string): WalletBalance | null {
  const cached = balanceCache.get(address);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION_MS) {
    balanceCache.delete(address);
    return null;
  }

  return cached.data;
}

export function clearBalanceCache(address?: string): void {
  if (address) {
    balanceCache.delete(address);
  } else {
    balanceCache.clear();
  }
}

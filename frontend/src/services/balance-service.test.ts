import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchWalletBalance,
  getCachedBalance,
  clearBalanceCache,
} from './balance-service';

describe('balance-service', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    clearBalanceCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('fetchWalletBalance', () => {
    it('fetches balance from Stacks API', async () => {
      const mockResponse = {
        balance: '1000000',
        locked: '500000',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchWalletBalance('SP123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/extended/v1/address/SP123/stx')
      );
      expect(result.stx).toBe(1000000);
      expect(result.stxLocked).toBe(500000);
    });

    it('throws error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchWalletBalance('SP123')).rejects.toThrow(
        'Failed to fetch balance'
      );
    });

    it('returns cached value within cache duration', async () => {
      const mockResponse = {
        balance: '2000000',
        locked: '0',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await fetchWalletBalance('SP123');
      const cachedResult = await fetchWalletBalance('SP123');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(cachedResult.stx).toBe(2000000);
    });

    it('handles zero balances', async () => {
      const mockResponse = {
        balance: '0',
        locked: '0',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchWalletBalance('SP456');

      expect(result.stx).toBe(0);
      expect(result.stxLocked).toBe(0);
    });
  });

  describe('getCachedBalance', () => {
    it('returns null when no cache exists', () => {
      expect(getCachedBalance('SP999')).toBeNull();
    });

    it('returns cached balance after fetch', async () => {
      const mockResponse = {
        balance: '5000000',
        locked: '1000000',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await fetchWalletBalance('SP123');

      const cached = getCachedBalance('SP123');
      expect(cached).not.toBeNull();
      expect(cached?.stx).toBe(5000000);
    });
  });

  describe('clearBalanceCache', () => {
    it('clears cache for specific address', async () => {
      const mockResponse = {
        balance: '1000000',
        locked: '0',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await fetchWalletBalance('SP123');
      expect(getCachedBalance('SP123')).not.toBeNull();

      clearBalanceCache('SP123');
      expect(getCachedBalance('SP123')).toBeNull();
    });

    it('clears all cache when no address provided', async () => {
      const mockResponse = {
        balance: '1000000',
        locked: '0',
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        });

      await fetchWalletBalance('SP123');
      await fetchWalletBalance('SP456');

      expect(getCachedBalance('SP123')).not.toBeNull();
      expect(getCachedBalance('SP456')).not.toBeNull();

      clearBalanceCache();

      expect(getCachedBalance('SP123')).toBeNull();
      expect(getCachedBalance('SP456')).toBeNull();
    });
  });
});

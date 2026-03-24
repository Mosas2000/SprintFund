import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchStxPrice, getCachedPrice, clearPriceCache } from './price-service';

describe('price-service', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    clearPriceCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('fetchStxPrice', () => {
    it('fetches price from CoinGecko API', async () => {
      const mockResponse = {
        blockstack: {
          usd: 1.25,
          usd_24h_change: 2.5,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchStxPrice();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('api.coingecko.com')
      );
      expect(result.usd).toBe(1.25);
      expect(result.usdChange24h).toBe(2.5);
      expect(result.lastUpdated).toBeGreaterThan(0);
    });

    it('throws error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchStxPrice()).rejects.toThrow('Failed to fetch STX price');
    });

    it('throws error on invalid response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await expect(fetchStxPrice()).rejects.toThrow('Invalid price response');
    });

    it('returns cached value within cache duration', async () => {
      const mockResponse = {
        blockstack: {
          usd: 1.25,
          usd_24h_change: 2.5,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await fetchStxPrice();
      const cachedResult = await fetchStxPrice();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(cachedResult.usd).toBe(1.25);
    });
  });

  describe('getCachedPrice', () => {
    it('returns null when no cache exists', () => {
      expect(getCachedPrice()).toBeNull();
    });

    it('returns cached price after fetch', async () => {
      const mockResponse = {
        blockstack: {
          usd: 1.5,
          usd_24h_change: -1.2,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await fetchStxPrice();

      const cached = getCachedPrice();
      expect(cached).not.toBeNull();
      expect(cached?.usd).toBe(1.5);
    });
  });

  describe('clearPriceCache', () => {
    it('clears the cache', async () => {
      const mockResponse = {
        blockstack: {
          usd: 1.0,
          usd_24h_change: 0,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await fetchStxPrice();
      expect(getCachedPrice()).not.toBeNull();

      clearPriceCache();
      expect(getCachedPrice()).toBeNull();
    });
  });
});

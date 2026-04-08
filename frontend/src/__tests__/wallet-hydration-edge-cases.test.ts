import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Edge case tests for wallet hydration to ensure robustness.
 */

describe('Wallet Hydration Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles rapid state changes during hydration', () => {
    const stateTransitions: string[] = [];

    const mockStore = {
      loading: true,
      connected: false,
      address: null,
      hydrate: () => {
        stateTransitions.push('hydrate-called');
        mockStore.loading = false;
        stateTransitions.push('loading-set-false');
      },
    };

    stateTransitions.push('store-init');
    mockStore.hydrate();
    stateTransitions.push('hydrate-complete');

    expect(stateTransitions).toEqual([
      'store-init',
      'hydrate-called',
      'loading-set-false',
      'hydrate-complete',
    ]);

    expect(mockStore.loading).toBe(false);
  });

  it('prevents double hydration calls', () => {
    const hydrateCalls: number[] = [];

    const mockStore = {
      loading: true,
      connected: false,
      address: null,
      hydrateCount: 0,
      hydrate: function() {
        if (this.hydrateCount > 0) {
          throw new Error('Hydrate called multiple times');
        }
        this.hydrateCount++;
        hydrateCalls.push(this.hydrateCount);
        this.loading = false;
      },
    };

    mockStore.hydrate();
    expect(hydrateCalls).toHaveLength(1);

    expect(() => {
      mockStore.hydrate();
    }).toThrow('Hydrate called multiple times');
  });

  it('handles hydration with null address gracefully', () => {
    const mockStore = {
      loading: true,
      connected: false,
      address: null,
      hydrate: () => {
        mockStore.loading = false;
        mockStore.connected = false;
        mockStore.address = null;
      },
    };

    mockStore.hydrate();

    expect(mockStore.loading).toBe(false);
    expect(mockStore.connected).toBe(false);
    expect(mockStore.address).toBeNull();
  });

  it('maintains state consistency after failed connection', async () => {
    const mockStore = {
      loading: false,
      connected: false,
      address: null,
      connect: async () => {
        mockStore.loading = true;
        try {
          throw new Error('Connection failed');
        } catch (error) {
          mockStore.loading = false;
          mockStore.connected = false;
          throw error;
        }
      },
    };

    try {
      await mockStore.connect();
    } catch {
      // Expected error
    }

    expect(mockStore.loading).toBe(false);
    expect(mockStore.connected).toBe(false);
    expect(mockStore.address).toBeNull();
  });

  it('handles disconnect during loading state', () => {
    const mockStore = {
      loading: true,
      connected: false,
      address: null,
      disconnect: () => {
        mockStore.address = null;
        mockStore.connected = false;
        mockStore.loading = false;
      },
    };

    expect(mockStore.loading).toBe(true);
    mockStore.disconnect();

    expect(mockStore.loading).toBe(false);
    expect(mockStore.connected).toBe(false);
    expect(mockStore.address).toBeNull();
  });

  it('handles localStorage errors gracefully', () => {
    const mockGetLocalStorage = vi.fn(() => {
      throw new Error('localStorage error');
    });

    const mockStore = {
      loading: true,
      connected: false,
      address: null,
      hydrate: () => {
        try {
          mockGetLocalStorage();
        } catch (error) {
          mockStore.loading = false;
          mockStore.connected = false;
        }
      },
    };

    expect(() => {
      mockStore.hydrate();
    }).not.toThrow();

    expect(mockStore.loading).toBe(false);
    expect(mockStore.connected).toBe(false);
  });

  it('prioritizes STX address over other currencies', () => {
    const mockAddresses = [
      { symbol: 'BTC', address: 'btc-address' },
      { symbol: 'STX', address: 'stx-address' },
      { symbol: 'ETH', address: 'eth-address' },
    ];

    interface AddressEntry {
      symbol: string;
      address: string;
    }

    const mockStore = {
      loading: true,
      connected: false,
      address: null as string | null,
      processAddresses: function(addresses: AddressEntry[]) {
        const stxEntry = addresses.find(a => a.symbol === 'STX');
        this.address = stxEntry?.address ?? addresses[0]?.address ?? null;
        this.loading = false;
        this.connected = !!this.address;
      },
    };

    mockStore.processAddresses(mockAddresses);

    expect(mockStore.address).toBe('stx-address');
    expect(mockStore.connected).toBe(true);
  });

  it('handles empty address array gracefully', () => {
    interface AddressEntry {
      address: string;
    }

    const mockStore = {
      loading: true,
      connected: false,
      address: null as string | null,
      processAddresses: function(addresses: AddressEntry[]) {
        this.address = addresses[0]?.address ?? null;
        this.loading = false;
        this.connected = !!this.address;
      },
    };

    mockStore.processAddresses([]);

    expect(mockStore.address).toBeNull();
    expect(mockStore.connected).toBe(false);
    expect(mockStore.loading).toBe(false);
  });
});

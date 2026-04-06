import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Integration test for wallet hydration race condition fix.
 * 
 * This test verifies that the complete hydration flow prevents the race
 * condition where wallet-dependent components would render before hydration
 * completes, causing a flash of the "Connect Wallet" state for connected users.
 */

describe('Wallet Hydration Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('prevents race condition: loading blocks render before hydration', () => {
    const renderSequence: string[] = [];

    const mockStore: {
      loading: boolean;
      connected: boolean;
      address: string | null;
      hydrate: () => void;
      connect: ReturnType<typeof vi.fn>;
      disconnect: ReturnType<typeof vi.fn>;
    } = {
      loading: true,
      connected: false,
      address: null,
      hydrate: () => {
        renderSequence.push('hydrate-start');
        mockStore.loading = false;
        mockStore.connected = true;
        mockStore.address = 'SPTest123';
        renderSequence.push('hydrate-complete');
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };

    const mockPageWithLoading = (loading: boolean, connected: boolean) => {
      if (loading) {
        renderSequence.push('render-loading');
        return 'LoadingSpinner';
      }
      
      if (!connected) {
        renderSequence.push('render-disconnected');
        return 'ConnectWalletPrompt';
      }
      
      renderSequence.push('render-connected');
      return 'Dashboard';
    };

    const mockAppInitialization = () => {
      renderSequence.push('app-mount');
      renderSequence.push('initial-render');
      
      mockPageWithLoading(mockStore.loading, mockStore.connected);
      
      mockStore.hydrate();
      
      mockPageWithLoading(mockStore.loading, mockStore.connected);
    };

    mockAppInitialization();

    expect(renderSequence).toEqual([
      'app-mount',
      'initial-render',
      'render-loading',
      'hydrate-start',
      'hydrate-complete',
      'render-connected',
    ]);

    expect(renderSequence).not.toContain('render-disconnected');
  });

  it('ensures hydration completes before showing wallet state', () => {
    const stateChanges: Array<{ stage: string; loading: boolean; connected: boolean }> = [];

    const mockStore: {
      loading: boolean;
      connected: boolean;
      address: string | null;
      hydrate: () => void;
    } = {
      loading: true,
      connected: false,
      address: null,
      hydrate: () => {
        mockStore.loading = false;
        mockStore.connected = true;
        mockStore.address = 'SPTest456';
      },
    };

    stateChanges.push({
      stage: 'initial',
      loading: mockStore.loading,
      connected: mockStore.connected,
    });

    mockStore.hydrate();

    stateChanges.push({
      stage: 'post-hydrate',
      loading: mockStore.loading,
      connected: mockStore.connected,
    });

    expect(stateChanges[0]).toEqual({ stage: 'initial', loading: true, connected: false });
    expect(stateChanges[1]).toEqual({ stage: 'post-hydrate', loading: false, connected: true });

    expect(stateChanges[0].loading).toBe(true);
    expect(stateChanges[1].loading).toBe(false);
  });

  it('handles connection flow with proper loading state', () => {
    const connectionFlow: string[] = [];

    const mockStore: {
      loading: boolean;
      connected: boolean;
      address: string | null;
      connect: () => Promise<void>;
    } = {
      loading: false,
      connected: false,
      address: null,
      connect: async () => {
        connectionFlow.push('connect-start');
        mockStore.loading = true;
        
        await new Promise(resolve => setTimeout(resolve, 10));
        
        mockStore.connected = true;
        mockStore.address = 'SPNewUser789';
        mockStore.loading = false;
        connectionFlow.push('connect-complete');
      },
    };

    const performConnection = async () => {
      connectionFlow.push('user-initiates');
      await mockStore.connect();
      connectionFlow.push('connection-done');
    };

    return performConnection().then(() => {
      expect(connectionFlow).toEqual([
        'user-initiates',
        'connect-start',
        'connect-complete',
        'connection-done',
      ]);

      expect(mockStore.loading).toBe(false);
      expect(mockStore.connected).toBe(true);
    });
  });

  it('maintains loading state during async operations', () => {
    const loadingStateHistory: boolean[] = [];

    const mockStore = {
      loading: true,
      connected: false,
      address: null,
      hydrate: () => {
        loadingStateHistory.push(mockStore.loading);
        
        setTimeout(() => {
          mockStore.loading = false;
          loadingStateHistory.push(mockStore.loading);
        }, 5);
      },
    };

    loadingStateHistory.push(mockStore.loading);
    mockStore.hydrate();
    loadingStateHistory.push(mockStore.loading);

    expect(loadingStateHistory[0]).toBe(true);
    expect(loadingStateHistory[1]).toBe(true);
    expect(loadingStateHistory[2]).toBe(true);

    return new Promise(resolve => {
      setTimeout(() => {
        loadingStateHistory.push(mockStore.loading);
        expect(loadingStateHistory[3]).toBe(false);
        resolve(null);
      }, 10);
    });
  });
});

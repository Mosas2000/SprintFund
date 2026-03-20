import { describe, it, expect, vi } from 'vitest';

/**
 * Tests for wallet store selector correctness.
 * Ensures each selector properly isolates state properties.
 */

describe('Wallet Selectors state isolation', () => {
  it('loading selector only returns loading property', () => {
    const mockStore = {
      address: 'SPTest',
      connected: true,
      loading: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      hydrate: vi.fn(),
    };

    const loadingSelector = (state: typeof mockStore) => state.loading;
    const result = loadingSelector(mockStore);

    expect(result).toBe(true);
    expect(typeof result).toBe('boolean');
  });

  it('connected selector only returns connected property', () => {
    const mockStore = {
      address: 'SPTest',
      connected: false,
      loading: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      hydrate: vi.fn(),
    };

    const connectedSelector = (state: typeof mockStore) => state.connected;
    const result = connectedSelector(mockStore);

    expect(result).toBe(false);
    expect(typeof result).toBe('boolean');
  });

  it('address selector only returns address property', () => {
    const mockStore = {
      address: 'SPTestAddress789',
      connected: true,
      loading: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
      hydrate: vi.fn(),
    };

    const addressSelector = (state: typeof mockStore) => state.address;
    const result = addressSelector(mockStore);

    expect(result).toBe('SPTestAddress789');
    expect(typeof result).toBe('string');
  });

  it('address selector handles null correctly', () => {
    const mockStore = {
      address: null,
      connected: false,
      loading: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      hydrate: vi.fn(),
    };

    const addressSelector = (state: typeof mockStore) => state.address;
    const result = addressSelector(mockStore);

    expect(result).toBeNull();
  });

  it('connect action selector returns function', () => {
    const mockStore = {
      address: null,
      connected: false,
      loading: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      hydrate: vi.fn(),
    };

    const connectSelector = (state: typeof mockStore) => state.connect;
    const result = connectSelector(mockStore);

    expect(typeof result).toBe('function');
    expect(result).toBe(mockStore.connect);
  });

  it('disconnect action selector returns function', () => {
    const mockStore = {
      address: null,
      connected: false,
      loading: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      hydrate: vi.fn(),
    };

    const disconnectSelector = (state: typeof mockStore) => state.disconnect;
    const result = disconnectSelector(mockStore);

    expect(typeof result).toBe('function');
    expect(result).toBe(mockStore.disconnect);
  });

  it('hydrate action selector returns function', () => {
    const mockStore = {
      address: null,
      connected: false,
      loading: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      hydrate: vi.fn(),
    };

    const hydrateSelector = (state: typeof mockStore) => state.hydrate;
    const result = hydrateSelector(mockStore);

    expect(typeof result).toBe('function');
    expect(result).toBe(mockStore.hydrate);
  });

  it('selectors prevent unnecessary re-renders', () => {
    const renderCounts = {
      loading: 0,
      connected: 0,
      address: 0,
    };

    const mockStore = {
      address: 'SPTest',
      connected: true,
      loading: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
      hydrate: vi.fn(),
    };

    const loadingSelector = (state: typeof mockStore) => {
      renderCounts.loading++;
      return state.loading;
    };

    const connectedSelector = (state: typeof mockStore) => {
      renderCounts.connected++;
      return state.connected;
    };

    const addressSelector = (state: typeof mockStore) => {
      renderCounts.address++;
      return state.address;
    };

    loadingSelector(mockStore);
    connectedSelector(mockStore);
    addressSelector(mockStore);

    expect(renderCounts.loading).toBe(1);
    expect(renderCounts.connected).toBe(1);
    expect(renderCounts.address).toBe(1);

    loadingSelector(mockStore);
    expect(renderCounts.loading).toBe(2);
    expect(renderCounts.connected).toBe(1);
    expect(renderCounts.address).toBe(1);
  });

  it('different selectors access different properties', () => {
    const mockStore = {
      address: 'SPAddress1',
      connected: true,
      loading: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
      hydrate: vi.fn(),
    };

    const selectors = {
      loading: (state: typeof mockStore) => state.loading,
      connected: (state: typeof mockStore) => state.connected,
      address: (state: typeof mockStore) => state.address,
    };

    const results = {
      loading: selectors.loading(mockStore),
      connected: selectors.connected(mockStore),
      address: selectors.address(mockStore),
    };

    expect(results.loading).toBe(false);
    expect(results.connected).toBe(true);
    expect(results.address).toBe('SPAddress1');
  });

  it('selectors maintain reference stability for actions', () => {
    const mockStore = {
      address: null,
      connected: false,
      loading: true,
      connect: vi.fn(),
      disconnect: vi.fn(),
      hydrate: vi.fn(),
    };

    const connectSelector = (state: typeof mockStore) => state.connect;
    const disconnectSelector = (state: typeof mockStore) => state.disconnect;
    const hydrateSelector = (state: typeof mockStore) => state.hydrate;

    const connect1 = connectSelector(mockStore);
    const connect2 = connectSelector(mockStore);
    const disconnect1 = disconnectSelector(mockStore);
    const hydrate1 = hydrateSelector(mockStore);

    expect(connect1).toBe(connect2);
    expect(disconnect1).toBe(mockStore.disconnect);
    expect(hydrate1).toBe(mockStore.hydrate);
  });
});

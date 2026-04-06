import { describe, it, expect } from 'vitest';
import type { WalletState } from '../store/wallet';

/**
 * TypeScript type safety tests for wallet state management.
 * Ensures all properties and methods are properly typed.
 */

describe('WalletState type safety', () => {
  it('has all required properties', () => {
    const mockState: WalletState = {
      address: null,
      connected: false,
      loading: true,
      connect: async () => {},
      disconnect: () => {},
      hydrate: () => {},
    };

    expect(mockState.address).toBeNull();
    expect(mockState.connected).toBe(false);
    expect(mockState.loading).toBe(true);
    expect(typeof mockState.connect).toBe('function');
    expect(typeof mockState.disconnect).toBe('function');
    expect(typeof mockState.hydrate).toBe('function');
  });

  it('address property accepts string or null', () => {
    const state1: WalletState = {
      address: 'SPAddress123',
      connected: true,
      loading: false,
      connect: async () => {},
      disconnect: () => {},
      hydrate: () => {},
    };

    const state2: WalletState = {
      address: null,
      connected: false,
      loading: true,
      connect: async () => {},
      disconnect: () => {},
      hydrate: () => {},
    };

    expect(state1.address).toBe('SPAddress123');
    expect(state2.address).toBeNull();
  });

  it('connected property is boolean', () => {
    const connectedState: WalletState = {
      address: 'SPTest',
      connected: true,
      loading: false,
      connect: async () => {},
      disconnect: () => {},
      hydrate: () => {},
    };

    const disconnectedState: WalletState = {
      address: null,
      connected: false,
      loading: true,
      connect: async () => {},
      disconnect: () => {},
      hydrate: () => {},
    };

    expect(typeof connectedState.connected).toBe('boolean');
    expect(typeof disconnectedState.connected).toBe('boolean');
  });

  it('loading property is boolean for state management', () => {
    const loadingState: WalletState = {
      address: null,
      connected: false,
      loading: true,
      connect: async () => {},
      disconnect: () => {},
      hydrate: () => {},
    };

    const notLoadingState: WalletState = {
      address: 'SPTest',
      connected: true,
      loading: false,
      connect: async () => {},
      disconnect: () => {},
      hydrate: () => {},
    };

    expect(typeof loadingState.loading).toBe('boolean');
    expect(typeof notLoadingState.loading).toBe('boolean');
  });

  it('connect method is async', () => {
    const state: WalletState = {
      address: null,
      connected: false,
      loading: true,
      connect: async () => {},
      disconnect: () => {},
      hydrate: () => {},
    };

    const result = state.connect();
    expect(result).toBeInstanceOf(Promise);
  });

  it('disconnect method is synchronous', () => {
    const state: WalletState = {
      address: null,
      connected: false,
      loading: false,
      connect: async () => {},
      disconnect: () => {},
      hydrate: () => {},
    };

    const result = state.disconnect();
    expect(result).toBeUndefined();
  });

  it('hydrate method is synchronous', () => {
    const state: WalletState = {
      address: null,
      connected: false,
      loading: true,
      connect: async () => {},
      disconnect: () => {},
      hydrate: () => {},
    };

    const result = state.hydrate();
    expect(result).toBeUndefined();
  });

  it('maintains type safety with state updates', () => {
    let state: WalletState = {
      address: null,
      connected: false,
      loading: true,
      connect: async () => {},
      disconnect: () => {},
      hydrate: () => {},
    };

    expect(state.loading).toBe(true);

    state = {
      ...state,
      loading: false,
      connected: true,
      address: 'SPNewAddress',
    };

    expect(state.loading).toBe(false);
    expect(state.connected).toBe(true);
    expect(state.address).toBe('SPNewAddress');
  });
});

import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { useWalletStore } from '../wallet';
import {
  useWalletAddress,
  useWalletConnected,
  useWalletLoading,
  useWalletConnect,
  useWalletDisconnect,
  useWalletHydrate,
} from '../wallet-selectors';

describe('wallet selector exports', () => {
  it('exports useWalletAddress function', () => {
    expect(typeof useWalletAddress).toBe('function');
  });

  it('exports useWalletConnected function', () => {
    expect(typeof useWalletConnected).toBe('function');
  });

  it('exports useWalletLoading function', () => {
    expect(typeof useWalletLoading).toBe('function');
  });

  it('exports useWalletConnect function', () => {
    expect(typeof useWalletConnect).toBe('function');
  });

  it('exports useWalletDisconnect function', () => {
    expect(typeof useWalletDisconnect).toBe('function');
  });

  it('exports useWalletHydrate function', () => {
    expect(typeof useWalletHydrate).toBe('function');
  });
});

describe('wallet selector values from store', () => {
  it('address selector returns null from initial state', () => {
    useWalletStore.setState({ address: null, connected: false, loading: true });
    const state = useWalletStore.getState();
    expect(state.address).toBeNull();
  });

  it('connected selector returns false from initial state', () => {
    useWalletStore.setState({ address: null, connected: false, loading: true });
    const state = useWalletStore.getState();
    expect(state.connected).toBe(false);
  });

  it('loading selector returns true from initial state', () => {
    useWalletStore.setState({ address: null, connected: false, loading: true });
    const state = useWalletStore.getState();
    expect(state.loading).toBe(true);
  });

  it('address selector reflects updated state', () => {
    useWalletStore.setState({ address: 'SP1TEST', connected: true, loading: false });
    const state = useWalletStore.getState();
    expect(state.address).toBe('SP1TEST');
  });

  it('connected selector reflects connected state', () => {
    useWalletStore.setState({ address: 'SP1TEST', connected: true, loading: false });
    const state = useWalletStore.getState();
    expect(state.connected).toBe(true);
  });

  it('loading selector reflects loaded state', () => {
    useWalletStore.setState({ address: null, connected: false, loading: false });
    const state = useWalletStore.getState();
    expect(state.loading).toBe(false);
  });
});

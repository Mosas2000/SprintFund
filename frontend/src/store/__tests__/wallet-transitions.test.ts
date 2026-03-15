import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { useWalletStore } from '../wallet';

describe('wallet store state transitions', () => {
  it('transitions from loading to disconnected on hydrate without session', async () => {
    useWalletStore.setState({ address: null, connected: false, loading: true });
    expect(useWalletStore.getState().loading).toBe(true);

    useWalletStore.getState().hydrate();

    const state = useWalletStore.getState();
    expect(state.loading).toBe(false);
    expect(state.connected).toBe(false);
  });

  it('transitions from disconnected to connected on connect', async () => {
    const { connect: stacksConnect } = await import('@stacks/connect');
    vi.mocked(stacksConnect).mockResolvedValue({
      addresses: [{ symbol: 'STX', address: 'SP1TRANS', publicKey: 'pk1' }],
    } as never);

    useWalletStore.setState({ address: null, connected: false, loading: false });

    await useWalletStore.getState().connect();

    expect(useWalletStore.getState().connected).toBe(true);
    expect(useWalletStore.getState().address).toBe('SP1TRANS');
  });

  it('transitions from connected to disconnected on disconnect', () => {
    useWalletStore.setState({ address: 'SP1ACTIVE', connected: true, loading: false });

    useWalletStore.getState().disconnect();

    expect(useWalletStore.getState().connected).toBe(false);
    expect(useWalletStore.getState().address).toBeNull();
  });

  it('does not change loading state on connect', async () => {
    const { connect: stacksConnect } = await import('@stacks/connect');
    vi.mocked(stacksConnect).mockResolvedValue({
      addresses: [{ symbol: 'STX', address: 'SP1TEST', publicKey: 'pk1' }],
    } as never);

    useWalletStore.setState({ address: null, connected: false, loading: false });

    await useWalletStore.getState().connect();

    expect(useWalletStore.getState().loading).toBe(false);
  });
});

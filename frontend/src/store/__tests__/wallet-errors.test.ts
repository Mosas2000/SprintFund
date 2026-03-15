import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { useWalletStore } from '../wallet';

describe('wallet connect error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useWalletStore.setState({ address: null, connected: false, loading: false });
  });

  it('stays disconnected when connect rejects', async () => {
    const { connect: stacksConnect } = await import('@stacks/connect');
    vi.mocked(stacksConnect).mockRejectedValueOnce(new Error('user cancelled'));

    await useWalletStore.getState().connect();

    expect(useWalletStore.getState().connected).toBe(false);
    expect(useWalletStore.getState().address).toBeNull();
  });

  it('stays disconnected when connect returns no addresses', async () => {
    const { connect: stacksConnect } = await import('@stacks/connect');
    vi.mocked(stacksConnect).mockResolvedValueOnce({ addresses: [] } as never);

    await useWalletStore.getState().connect();

    // With no STX address found, should stay disconnected
    expect(useWalletStore.getState().connected).toBe(false);
  });
});

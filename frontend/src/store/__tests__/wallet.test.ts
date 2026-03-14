import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { connect, disconnect, isConnected, getLocalStorage } from '@stacks/connect';
import { useWalletStore } from '../wallet';

const mockConnect = vi.mocked(connect);
const mockDisconnect = vi.mocked(disconnect);
const mockIsConnected = vi.mocked(isConnected);
const mockGetLocalStorage = vi.mocked(getLocalStorage);

beforeEach(() => {
  vi.clearAllMocks();
  useWalletStore.setState({
    address: null,
    connected: false,
    loading: true,
  });
});

describe('wallet store initial state', () => {
  it('starts with address as null', () => {
    const state = useWalletStore.getState();
    expect(state.address).toBeNull();
  });

  it('starts with connected as false', () => {
    const state = useWalletStore.getState();
    expect(state.connected).toBe(false);
  });

  it('starts with loading as true', () => {
    const state = useWalletStore.getState();
    expect(state.loading).toBe(true);
  });

  it('exposes connect function', () => {
    const state = useWalletStore.getState();
    expect(typeof state.connect).toBe('function');
  });

  it('exposes disconnect function', () => {
    const state = useWalletStore.getState();
    expect(typeof state.disconnect).toBe('function');
  });

  it('exposes hydrate function', () => {
    const state = useWalletStore.getState();
    expect(typeof state.hydrate).toBe('function');
  });
});

describe('wallet store connect', () => {
  it('sets address and connected on successful connection with STX symbol', async () => {
    mockConnect.mockResolvedValue({
      addresses: [
        { symbol: 'STX', address: 'SP1WALLET', publicKey: 'pk1' },
      ],
    } as never);

    await useWalletStore.getState().connect();

    const state = useWalletStore.getState();
    expect(state.address).toBe('SP1WALLET');
    expect(state.connected).toBe(true);
  });

  it('prefers STX entry over other address entries', async () => {
    mockConnect.mockResolvedValue({
      addresses: [
        { symbol: 'BTC', address: 'bc1wrong', publicKey: 'pk0' },
        { symbol: 'STX', address: 'SP1CORRECT', publicKey: 'pk1' },
      ],
    } as never);

    await useWalletStore.getState().connect();

    expect(useWalletStore.getState().address).toBe('SP1CORRECT');
  });

  it('uses first address when no STX symbol entry exists', async () => {
    mockConnect.mockResolvedValue({
      addresses: [
        { address: 'SP1FIRST', publicKey: 'pk0' },
      ],
    } as never);

    await useWalletStore.getState().connect();

    expect(useWalletStore.getState().address).toBe('SP1FIRST');
  });

  it('falls back to localStorage when addresses array is empty', async () => {
    mockConnect.mockResolvedValue({ addresses: [] } as never);
    mockGetLocalStorage.mockReturnValue({
      addresses: { stx: [{ address: 'SP1STORED' }] },
    } as never);

    await useWalletStore.getState().connect();

    expect(useWalletStore.getState().address).toBe('SP1STORED');
    expect(useWalletStore.getState().connected).toBe(true);
  });

  it('stays disconnected when connect returns no addresses and localStorage is empty', async () => {
    mockConnect.mockResolvedValue({ addresses: [] } as never);
    mockGetLocalStorage.mockReturnValue(null as never);

    await useWalletStore.getState().connect();

    expect(useWalletStore.getState().address).toBeNull();
    expect(useWalletStore.getState().connected).toBe(false);
  });

  it('stays disconnected when connect throws an error', async () => {
    mockConnect.mockRejectedValue(new Error('user closed modal'));

    await useWalletStore.getState().connect();

    expect(useWalletStore.getState().address).toBeNull();
    expect(useWalletStore.getState().connected).toBe(false);
  });

  it('handles lowercase stx symbol', async () => {
    mockConnect.mockResolvedValue({
      addresses: [
        { symbol: 'stx', address: 'SP1LOWER', publicKey: 'pk1' },
      ],
    } as never);

    await useWalletStore.getState().connect();

    expect(useWalletStore.getState().address).toBe('SP1LOWER');
  });

  it('handles null result from connect', async () => {
    mockConnect.mockResolvedValue(null as never);
    mockGetLocalStorage.mockReturnValue(null as never);

    await useWalletStore.getState().connect();

    expect(useWalletStore.getState().connected).toBe(false);
  });
});

describe('wallet store disconnect', () => {
  it('clears address on disconnect', () => {
    useWalletStore.setState({ address: 'SP1ADDR', connected: true });

    useWalletStore.getState().disconnect();

    expect(useWalletStore.getState().address).toBeNull();
  });

  it('sets connected to false', () => {
    useWalletStore.setState({ address: 'SP1ADDR', connected: true });

    useWalletStore.getState().disconnect();

    expect(useWalletStore.getState().connected).toBe(false);
  });

  it('calls the stacks disconnect function', () => {
    useWalletStore.setState({ address: 'SP1ADDR', connected: true });

    useWalletStore.getState().disconnect();

    expect(mockDisconnect).toHaveBeenCalledOnce();
  });
});

describe('wallet store hydrate', () => {
  it('sets address from localStorage when connected', () => {
    mockIsConnected.mockReturnValue(true as never);
    mockGetLocalStorage.mockReturnValue({
      addresses: { stx: [{ address: 'SP1HYDRATED' }] },
    } as never);

    useWalletStore.getState().hydrate();

    const state = useWalletStore.getState();
    expect(state.address).toBe('SP1HYDRATED');
    expect(state.connected).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('sets loading to false when not connected', () => {
    mockIsConnected.mockReturnValue(false as never);

    useWalletStore.getState().hydrate();

    const state = useWalletStore.getState();
    expect(state.loading).toBe(false);
    expect(state.address).toBeNull();
  });

  it('sets loading to false when isConnected throws', () => {
    mockIsConnected.mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    useWalletStore.getState().hydrate();

    expect(useWalletStore.getState().loading).toBe(false);
  });

  it('handles null localStorage data when connected', () => {
    mockIsConnected.mockReturnValue(true as never);
    mockGetLocalStorage.mockReturnValue(null as never);

    useWalletStore.getState().hydrate();

    const state = useWalletStore.getState();
    expect(state.address).toBeNull();
    expect(state.connected).toBe(false);
    expect(state.loading).toBe(false);
  });

  it('handles localStorage without stx addresses', () => {
    mockIsConnected.mockReturnValue(true as never);
    mockGetLocalStorage.mockReturnValue({
      addresses: {},
    } as never);

    useWalletStore.getState().hydrate();

    expect(useWalletStore.getState().address).toBeNull();
  });

  it('handles localStorage with empty stx array', () => {
    mockIsConnected.mockReturnValue(true as never);
    mockGetLocalStorage.mockReturnValue({
      addresses: { stx: [] },
    } as never);

    useWalletStore.getState().hydrate();

    expect(useWalletStore.getState().address).toBeNull();
  });
});

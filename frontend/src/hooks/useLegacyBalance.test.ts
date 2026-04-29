import { renderHook, waitFor } from '@testing-library/react';
import { useLegacyBalance } from './useLegacyBalance';
import { callReadOnlyFunction } from '@stacks/transactions';

jest.mock('@stacks/transactions');

const mockCallReadOnlyFunction = callReadOnlyFunction as jest.MockedFunction<
  typeof callReadOnlyFunction
>;

describe('useLegacyBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial loading state', () => {
    const { result } = renderHook(() => useLegacyBalance('SP123'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasLegacyAssets).toBe(false);
  });

  it('should return not loading when no address provided', () => {
    const { result } = renderHook(() => useLegacyBalance(undefined));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasLegacyAssets).toBe(false);
  });

  it('should detect legacy stake', async () => {
    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: 100000000n, // 100 STX
    } as any);

    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: 50n, // reputation
    } as any);

    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: {
        amount: 0n,
        unlockHeight: 0n,
      },
    } as any);

    const { result } = renderHook(() => useLegacyBalance('SP123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasLegacyAssets).toBe(true);
    expect(result.current.stakedAmount).toBe(100000000);
    expect(result.current.stakedSTX).toBe(100);
    expect(result.current.reputation).toBe(50);
    expect(result.current.hasActiveLocks).toBe(false);
    expect(result.current.canMigrateNow).toBe(true);
  });

  it('should detect active vote locks', async () => {
    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: 100000000n,
    } as any);

    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: 0n,
    } as any);

    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: {
        amount: 50000000n,
        unlockHeight: 12345n,
      },
    } as any);

    const { result } = renderHook(() => useLegacyBalance('SP123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasActiveLocks).toBe(true);
    expect(result.current.lockAmount).toBe(50000000);
    expect(result.current.unlockHeight).toBe(12345);
    expect(result.current.canMigrateNow).toBe(false);
  });

  it('should handle no legacy assets', async () => {
    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: 0n,
    } as any);

    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: 0n,
    } as any);

    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: {
        amount: 0n,
        unlockHeight: 0n,
      },
    } as any);

    const { result } = renderHook(() => useLegacyBalance('SP123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasLegacyAssets).toBe(false);
    expect(result.current.canMigrateNow).toBe(false);
  });

  it('should handle errors gracefully', async () => {
    mockCallReadOnlyFunction.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useLegacyBalance('SP123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.hasLegacyAssets).toBe(false);
  });

  it('should handle missing reputation function', async () => {
    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: 100000000n,
    } as any);

    mockCallReadOnlyFunction.mockRejectedValueOnce(new Error('Function not found'));

    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: {
        amount: 0n,
        unlockHeight: 0n,
      },
    } as any);

    const { result } = renderHook(() => useLegacyBalance('SP123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasLegacyAssets).toBe(true);
    expect(result.current.reputation).toBe(0);
  });

  it('should handle missing lock function', async () => {
    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: 100000000n,
    } as any);

    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: 0n,
    } as any);

    mockCallReadOnlyFunction.mockRejectedValueOnce(new Error('Function not found'));

    const { result } = renderHook(() => useLegacyBalance('SP123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasLegacyAssets).toBe(true);
    expect(result.current.hasActiveLocks).toBe(false);
  });

  it('should check v2 contract when specified', async () => {
    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: 50000000n,
    } as any);

    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: 25n,
    } as any);

    mockCallReadOnlyFunction.mockResolvedValueOnce({
      value: {
        amount: 0n,
        unlockHeight: 0n,
      },
    } as any);

    const { result } = renderHook(() => useLegacyBalance('SP123', 'v2'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasLegacyAssets).toBe(true);
    expect(result.current.stakedSTX).toBe(50);
    expect(result.current.reputation).toBe(25);
  });

  it('should update when address changes', async () => {
    mockCallReadOnlyFunction.mockResolvedValue({
      value: 100000000n,
    } as any);

    const { result, rerender } = renderHook(
      ({ address }) => useLegacyBalance(address),
      { initialProps: { address: 'SP123' } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasLegacyAssets).toBe(true);

    mockCallReadOnlyFunction.mockClear();
    mockCallReadOnlyFunction.mockResolvedValue({
      value: 0n,
    } as any);

    rerender({ address: 'SP456' });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockCallReadOnlyFunction).toHaveBeenCalled();
  });
});

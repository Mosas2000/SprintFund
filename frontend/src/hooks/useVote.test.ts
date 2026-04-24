import { renderHook, waitFor } from '@testing-library/react';
import { useVote } from './useVote';
import * as stacksLib from '@/lib/stacks';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/lib/stacks', () => ({
  getVote: vi.fn(),
}));

describe('useVote', () => {
  const mockVote = {
    proposalId: 1,
    voter: 'ST1234',
    support: true,
    weight: 100,
    costPaid: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when voterAddress is missing', async () => {
    const { result } = renderHook(() => useVote(1, undefined));

    expect(result.current.loading).toBe(false);
    expect(result.current.vote).toBeNull();
    expect(stacksLib.getVote).not.toHaveBeenCalled();
  });

  it('should fetch and return vote data', async () => {
    vi.mocked(stacksLib.getVote).mockResolvedValueOnce(mockVote);

    const { result } = renderHook(() => useVote(1, 'ST1234'));

    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vote).toEqual(mockVote);
    expect(result.current.error).toBeNull();
    expect(stacksLib.getVote).toHaveBeenCalledWith(1, 'ST1234');
  });

  it('should handle errors from getVote', async () => {
    vi.mocked(stacksLib.getVote).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useVote(1, 'ST1234'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vote).toBeNull();
    expect(result.current.error).toEqual(new Error('Network error'));
  });

  it('should allow manual refresh', async () => {
    vi.mocked(stacksLib.getVote)
      .mockResolvedValueOnce(mockVote)
      .mockResolvedValueOnce({ ...mockVote, costPaid: 0 });

    const { result } = renderHook(() => useVote(1, 'ST1234'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vote?.costPaid).toBe(10);

    result.current.refresh();

    await waitFor(() => {
      expect(result.current.vote?.costPaid).toBe(0);
    });

    expect(stacksLib.getVote).toHaveBeenCalledTimes(2);
  });
});

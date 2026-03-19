import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBlockchainCacheInvalidation } from './useCacheInvalidation';
import * as stacksLib from '../lib/stacks';

vi.mock('../lib/stacks', () => ({
  invalidateProposalCache: vi.fn(),
  invalidateProposalPagesCache: vi.fn(),
  invalidateProposalCountCache: vi.fn(),
  invalidateStakeCache: vi.fn(),
  invalidateAllBlockchainCache: vi.fn(),
}));

describe('useBlockchainCacheInvalidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide invalidation functions', () => {
    const { result } = renderHook(() => useBlockchainCacheInvalidation());

    expect(result.current.invalidateProposal).toBeDefined();
    expect(result.current.invalidateProposals).toBeDefined();
    expect(result.current.invalidateStake).toBeDefined();
    expect(result.current.invalidateAll).toBeDefined();
  });

  it('should call invalidateProposalCache', () => {
    const { result } = renderHook(() => useBlockchainCacheInvalidation());

    result.current.invalidateProposal(123);

    expect(stacksLib.invalidateProposalCache).toHaveBeenCalledWith(123);
  });

  it('should call invalidateStakeCache', () => {
    const { result } = renderHook(() => useBlockchainCacheInvalidation());

    result.current.invalidateStake('SP123');

    expect(stacksLib.invalidateStakeCache).toHaveBeenCalledWith('SP123');
  });

  it('should call all invalidate functions', () => {
    const { result } = renderHook(() => useBlockchainCacheInvalidation());

    result.current.invalidateProposals();

    expect(stacksLib.invalidateProposalPagesCache).toHaveBeenCalled();
    expect(stacksLib.invalidateProposalCountCache).toHaveBeenCalled();
  });

  it('should invalidate all cache', () => {
    const { result } = renderHook(() => useBlockchainCacheInvalidation());

    result.current.invalidateAll();

    expect(stacksLib.invalidateAllBlockchainCache).toHaveBeenCalled();
  });
});

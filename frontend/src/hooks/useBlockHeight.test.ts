import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBlockHeight, useProposalBlockHeight } from './useBlockHeight';
import type { Proposal } from '../types';

describe('useBlockHeight hook', () => {
  describe('useBlockHeight', () => {
    it('should format block height with all results', () => {
      const { result } = renderHook(() => useBlockHeight(12345));
      expect(result.current.formattedFull).toBeTruthy();
      expect(result.current.formattedShort).toBeTruthy();
      expect(result.current.displayedTime).toBe(result.current.formattedFull);
      expect(result.current.estimatedTimestamp).toBeTruthy();
    });

    it('should handle null', () => {
      const { result } = renderHook(() => useBlockHeight(null));
      expect(result.current.formattedFull).toBe('Block #0');
      expect(result.current.formattedShort).toBe('Block #0');
      expect(result.current.estimatedTimestamp).toBeNull();
    });

    it('should handle undefined', () => {
      const { result } = renderHook(() => useBlockHeight(undefined));
      expect(result.current.formattedFull).toBe('Block #0');
      expect(result.current.estimatedTimestamp).toBeNull();
    });

    it('should handle zero', () => {
      const { result } = renderHook(() => useBlockHeight(0));
      expect(result.current.formattedShort).toBe('Block #0');
      expect(result.current.estimatedTimestamp).toBeTruthy();
    });
  });

  describe('useProposalBlockHeight', () => {
    it('should extract and format proposal block height', () => {
      const mockProposal: Proposal = {
        id: 1,
        title: 'Test',
        description: 'Test proposal',
        amount: 1000000,
        proposer: 'SP123',
        votesFor: 10,
        votesAgainst: 5,
        executed: false,
        createdAt: 50000,
        votingEndsAt: 50432,
        executionAllowedAt: 50576,
      };

      const { result } = renderHook(() => useProposalBlockHeight(mockProposal));
      expect(result.current.formattedFull).toContain('Block #50,000');
      expect(result.current.estimatedTimestamp).toBeTruthy();
    });

    it('should handle null proposal', () => {
      const { result } = renderHook(() => useProposalBlockHeight(null));
      expect(result.current.formattedFull).toBe('Block #0');
      expect(result.current.estimatedTimestamp).toBeNull();
    });
  });
});

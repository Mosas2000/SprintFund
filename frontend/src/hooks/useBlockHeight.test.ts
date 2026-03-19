import { describe, it, expect } from 'vitest';
import { useBlockHeight, useProposalBlockHeight } from './useBlockHeight';
import type { Proposal } from '../types';

describe('useBlockHeight hook', () => {
  describe('useBlockHeight', () => {
    it('should format block height with all results', () => {
      const result = useBlockHeight(12345);
      expect(result.formattedFull).toBeTruthy();
      expect(result.formattedShort).toBeTruthy();
      expect(result.displayedTime).toBe(result.formattedFull);
      expect(result.estimatedTimestamp).toBeTruthy();
    });

    it('should handle null', () => {
      const result = useBlockHeight(null);
      expect(result.formattedFull).toBe('Block #0');
      expect(result.formattedShort).toBe('Block #0');
      expect(result.estimatedTimestamp).toBeNull();
    });

    it('should handle undefined', () => {
      const result = useBlockHeight(undefined);
      expect(result.formattedFull).toBe('Block #0');
      expect(result.estimatedTimestamp).toBeNull();
    });

    it('should handle zero', () => {
      const result = useBlockHeight(0);
      expect(result.formattedShort).toBe('Block #0');
      expect(result.estimatedTimestamp).toBeTruthy();
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
      };

      const result = useProposalBlockHeight(mockProposal);
      expect(result.formattedFull).toContain('Block #50,000');
      expect(result.estimatedTimestamp).toBeTruthy();
    });

    it('should handle null proposal', () => {
      const result = useProposalBlockHeight(null);
      expect(result.formattedFull).toBe('Block #0');
      expect(result.estimatedTimestamp).toBeNull();
    });
  });
});

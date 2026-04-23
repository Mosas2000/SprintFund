import { describe, it, expect } from 'vitest';
import {
  calculateTotalVotes,
  calculateForPercentage,
  calculateAgainstPercentage,
  isProposalActive,
  calculateProposalAge,
  enrichProposal,
  filterProposalsByStatus,
  sortProposals,
  findProposal,
  wouldProposalPass,
  paginateProposals,
} from './proposal-utils';
import type { Proposal } from '../types/proposal';

const mockProposal: Proposal = {
  id: 1,
  proposer: 'SP123456',
  amount: 1000000,
  title: 'Test Proposal',
  description: 'A test proposal',
  votesFor: 100,
  votesAgainst: 30,
  executed: false,
  createdAt: 100000,
  votingEndsAt: 100432,
  executionAllowedAt: 100576,
};

const executedProposal: Proposal = {
  ...mockProposal,
  id: 2,
  executed: true,
};

describe('Proposal utilities', () => {
  describe('calculateTotalVotes', () => {
    it('sums votes for and against', () => {
      expect(calculateTotalVotes(mockProposal)).toBe(130);
    });

    it('returns 0 when no votes', () => {
      const noVotes = { ...mockProposal, votesFor: 0, votesAgainst: 0 };
      expect(calculateTotalVotes(noVotes)).toBe(0);
    });
  });

  describe('calculateForPercentage', () => {
    it('calculates correct percentage', () => {
      expect(calculateForPercentage(mockProposal)).toBe(77);
    });

    it('returns 0 when no votes', () => {
      const noVotes = { ...mockProposal, votesFor: 0, votesAgainst: 0 };
      expect(calculateForPercentage(noVotes)).toBe(0);
    });
  });

  describe('calculateAgainstPercentage', () => {
    it('calculates correct percentage', () => {
      expect(calculateAgainstPercentage(mockProposal)).toBe(23);
    });

    it('returns 0 when no votes', () => {
      const noVotes = { ...mockProposal, votesFor: 0, votesAgainst: 0 };
      expect(calculateAgainstPercentage(noVotes)).toBe(0);
    });
  });

  describe('isProposalActive', () => {
    it('returns true for unexecuted proposals', () => {
      expect(isProposalActive(mockProposal)).toBe(true);
    });

    it('returns false for executed proposals', () => {
      expect(isProposalActive(executedProposal)).toBe(false);
    });
  });

  describe('calculateProposalAge', () => {
    it('calculates age in days using block height', () => {
      // 100000 is ~1.9 years after genesis (0), so it should be > 0
      const age = calculateProposalAge(mockProposal);
      expect(age).toBeGreaterThan(0);
    });
  });

  describe('enrichProposal', () => {
    it('adds all derived fields', () => {
      const enriched = enrichProposal(mockProposal);
      expect(enriched.totalVotes).toBe(130);
      expect(enriched.forPercentage).toBe(77);
      expect(enriched.againstPercentage).toBe(23);
      expect(enriched.isActive).toBe(true);
      expect(enriched.daysOld).toBeGreaterThanOrEqual(0);
    });
  });

  describe('filterProposalsByStatus', () => {
    const proposals = [mockProposal, executedProposal];

    it('returns all when status is all', () => {
      expect(filterProposalsByStatus(proposals, 'all')).toHaveLength(2);
    });

    it('returns only active proposals', () => {
      const active = filterProposalsByStatus(proposals, 'active');
      expect(active).toHaveLength(1);
      expect(active[0].executed).toBe(false);
    });

    it('returns only executed proposals', () => {
      const executed = filterProposalsByStatus(proposals, 'executed');
      expect(executed).toHaveLength(1);
      expect(executed[0].executed).toBe(true);
    });
  });

  describe('sortProposals', () => {
    const proposal2: Proposal = { ...mockProposal, id: 2, createdAt: mockProposal.createdAt - 1000 };
    const proposals = [mockProposal, proposal2];

    it('sorts by newest by default', () => {
      const sorted = sortProposals(proposals);
      expect(sorted[0].createdAt).toBeGreaterThanOrEqual(sorted[1].createdAt);
    });

    it('sorts by oldest', () => {
      const sorted = sortProposals(proposals, 'oldest');
      expect(sorted[0].createdAt).toBeLessThanOrEqual(sorted[1].createdAt);
    });

    it('sorts by highest amount', () => {
      const low = { ...mockProposal, id: 1, amount: 500 };
      const high = { ...mockProposal, id: 2, amount: 5000 };
      const sorted = sortProposals([low, high], 'highest');
      expect(sorted[0].amount).toBeGreaterThan(sorted[1].amount);
    });

    it('sorts by lowest amount', () => {
      const low = { ...mockProposal, id: 1, amount: 500 };
      const high = { ...mockProposal, id: 2, amount: 5000 };
      const sorted = sortProposals([high, low], 'lowest');
      expect(sorted[0].amount).toBeLessThan(sorted[1].amount);
    });

    it('sorts by highest amount with equal amounts', () => {
      const p1 = { ...mockProposal, id: 1, amount: 1000 };
      const p2 = { ...mockProposal, id: 2, amount: 1000 };
      const sorted = sortProposals([p1, p2], 'highest');
      expect(sorted[0].amount).toEqual(sorted[1].amount);
    });

    it('sorts by most votes', () => {
      const p1 = { ...mockProposal, votesFor: 10, votesAgainst: 5 };
      const p2 = { ...mockProposal, id: 2, votesFor: 50, votesAgainst: 20 };
      const sorted = sortProposals([p1, p2], 'most-votes');
      expect(calculateTotalVotes(sorted[0])).toBeGreaterThan(calculateTotalVotes(sorted[1]));
    });

    it('ending-soon: places active proposals before executed ones', () => {
      const active = { ...mockProposal, id: 1, executed: false, votingEndsAt: 1000 };
      const executed = { ...mockProposal, id: 2, executed: true, votingEndsAt: 500 };
      const sorted = sortProposals([executed, active], 'ending-soon');
      expect(sorted[0].executed).toBe(false);
      expect(sorted[1].executed).toBe(true);
    });

    it('ending-soon: orders active proposals by ascending votingEndsAt', () => {
      const endsSooner = { ...mockProposal, id: 1, executed: false, votingEndsAt: 100200 };
      const endsLater = { ...mockProposal, id: 2, executed: false, votingEndsAt: 100500 };
      const sorted = sortProposals([endsLater, endsSooner], 'ending-soon');
      expect(sorted[0].votingEndsAt).toBe(100200);
      expect(sorted[1].votingEndsAt).toBe(100500);
    });

    it('ending-soon: sorts executed proposals by ascending votingEndsAt when all are executed', () => {
      const early = { ...mockProposal, id: 1, executed: true, votingEndsAt: 200 };
      const late = { ...mockProposal, id: 2, executed: true, votingEndsAt: 800 };
      const sorted = sortProposals([late, early], 'ending-soon');
      expect(sorted[0].votingEndsAt).toBe(200);
      expect(sorted[1].votingEndsAt).toBe(800);
    });
  });

  describe('findProposal', () => {
    const proposals = [mockProposal, executedProposal];

    it('finds proposal by ID', () => {
      expect(findProposal(proposals, 1)).toEqual(mockProposal);
      expect(findProposal(proposals, 2)).toEqual(executedProposal);
    });

    it('returns undefined when not found', () => {
      expect(findProposal(proposals, 999)).toBeUndefined();
    });
  });

  describe('wouldProposalPass', () => {
    it('returns true when votes for exceed votes against', () => {
      expect(wouldProposalPass(mockProposal)).toBe(true);
    });

    it('returns false when votes against exceed votes for', () => {
      const failing = { ...mockProposal, votesFor: 30, votesAgainst: 100 };
      expect(wouldProposalPass(failing)).toBe(false);
    });

    it('returns false when no votes', () => {
      const noVotes = { ...mockProposal, votesFor: 0, votesAgainst: 0 };
      expect(wouldProposalPass(noVotes)).toBe(false);
    });

    it('returns false when votes are equal', () => {
      const equalVotes = { ...mockProposal, votesFor: 10, votesAgainst: 10 };
      expect(wouldProposalPass(equalVotes)).toBe(false);
    });
  });

  describe('paginateProposals', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    it('returns first page', () => {
      expect(paginateProposals(items, 1, 3)).toEqual([1, 2, 3]);
    });

    it('returns middle page', () => {
      expect(paginateProposals(items, 2, 3)).toEqual([4, 5, 6]);
    });

    it('returns last partial page', () => {
      expect(paginateProposals(items, 4, 3)).toEqual([10]);
    });

    it('returns empty array for out of bounds page', () => {
      expect(paginateProposals(items, 5, 3)).toEqual([]);
    });

    it('handles empty input array', () => {
      expect(paginateProposals([], 1, 10)).toEqual([]);
    });
  });

  describe('formatBlockDuration', () => {
    it('formats minutes correctly', () => {
      expect(formatBlockDuration(1)).toBe('10m');
      expect(formatBlockDuration(5)).toBe('50m');
    });

    it('formats hours correctly', () => {
      expect(formatBlockDuration(6)).toBe('1h');
      expect(formatBlockDuration(9)).toBe('1h 30m');
    });

    it('formats days correctly', () => {
      expect(formatBlockDuration(144)).toBe('1d');
      expect(formatBlockDuration(200)).toBe('1d 9h 20m');
      expect(formatBlockDuration(432)).toBe('3d');
    });

    it('handles zero or negative blocks', () => {
      expect(formatBlockDuration(0)).toBe('0m');
      expect(formatBlockDuration(-10)).toBe('0m');
    });

    it('formats large block counts correctly', () => {
      // 4320 blocks is 30 days
      expect(formatBlockDuration(4320)).toBe('30d');
      // 4326 blocks is 30 days and 1 hour
      expect(formatBlockDuration(4326)).toBe('30d 1h');
    });
  });

  describe('Countdown calculations', () => {
    it('getBlocksUntilVotingEnds returns correct difference', () => {
      const proposal = { ...mockProposal, votingEndsAt: 100500 };
      expect(getBlocksUntilVotingEnds(proposal, 100400)).toBe(100);
      expect(getBlocksUntilVotingEnds(proposal, 100600)).toBe(0);
    });

    it('getBlocksUntilExecutionAllowed returns correct difference', () => {
      const proposal = { ...mockProposal, executionAllowedAt: 100600 };
      expect(getBlocksUntilExecutionAllowed(proposal, 100400)).toBe(200);
      expect(getBlocksUntilExecutionAllowed(proposal, 100700)).toBe(0);
    });
  });
});

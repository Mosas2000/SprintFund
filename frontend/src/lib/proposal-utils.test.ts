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
  createdAt: Math.floor(Date.now() / 1000) - 86400,
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
    it('calculates age in days', () => {
      const now = Math.floor(Date.now() / 1000) * 1000;
      const proposal: Proposal = {
        ...mockProposal,
        createdAt: Math.floor((now - 86400000) / 1000),
      };
      const age = calculateProposalAge(proposal, now);
      expect(age).toBe(1);
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

    it('sorts by most votes', () => {
      const p1 = { ...mockProposal, votesFor: 10, votesAgainst: 5 };
      const p2 = { ...mockProposal, id: 2, votesFor: 50, votesAgainst: 20 };
      const sorted = sortProposals([p1, p2], 'most-votes');
      expect(calculateTotalVotes(sorted[0])).toBeGreaterThan(calculateTotalVotes(sorted[1]));
    });

    it('ending-soon: places active proposals before executed ones', () => {
      const active = { ...mockProposal, id: 1, executed: false, createdAt: 1000 };
      const executed = { ...mockProposal, id: 2, executed: true, createdAt: 500 };
      const sorted = sortProposals([executed, active], 'ending-soon');
      expect(sorted[0].executed).toBe(false);
      expect(sorted[1].executed).toBe(true);
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
  });
});

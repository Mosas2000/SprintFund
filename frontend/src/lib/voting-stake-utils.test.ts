import { describe, it, expect } from 'vitest';
import {
  calculateVotingPower,
  canUserVote,
  calculateQuorumPercentage,
  isQuorumReached,
  calculateTotalStaked,
  calculateWeightedVote,
  aggregateVotingStats,
  hasUserVoted,
  findUserVote,
  calculateStakeForVotingPower,
  formatStxAmount,
  isValidVoteWeight,
  calculateVoteMargin,
} from './voting-stake-utils';
import type { Proposal, StakeInfo, VoteRecord } from '../types';

const mockProposal: Proposal = {
  id: 1,
  proposer: 'SP123456',
  amount: 1000000,
  title: 'Test',
  description: 'Test',
  votesFor: 100,
  votesAgainst: 30,
  executed: false,
  createdAt: 1000000,
};

describe('Voting utilities', () => {
  describe('calculateVotingPower', () => {
    it('calculates voting power as sqrt of stake', () => {
      expect(calculateVotingPower(10000)).toBe(100);
      expect(calculateVotingPower(1000000)).toBe(1000);
    });

    it('returns 0 for zero or negative stakes', () => {
      expect(calculateVotingPower(0)).toBe(0);
      expect(calculateVotingPower(-100)).toBe(0);
    });
  });

  describe('canUserVote', () => {
    it('returns true for unexecuted proposal with stake', () => {
      expect(canUserVote(mockProposal, 1000)).toBe(true);
    });

    it('returns false for executed proposal', () => {
      const executed = { ...mockProposal, executed: true };
      expect(canUserVote(executed, 1000)).toBe(false);
    });

    it('returns false with zero stake', () => {
      expect(canUserVote(mockProposal, 0)).toBe(false);
    });
  });

  describe('calculateQuorumPercentage', () => {
    it('calculates percentage correctly', () => {
      expect(calculateQuorumPercentage(50, 100)).toBe(50);
      expect(calculateQuorumPercentage(75, 100)).toBe(75);
    });

    it('returns 0 when no total staked', () => {
      expect(calculateQuorumPercentage(10, 0)).toBe(0);
    });
  });

  describe('isQuorumReached', () => {
    it('returns true when threshold exceeded', () => {
      expect(isQuorumReached(60, 100, 50)).toBe(true);
    });

    it('returns false when threshold not met', () => {
      expect(isQuorumReached(40, 100, 50)).toBe(false);
    });
  });

  describe('calculateTotalStaked', () => {
    it('sums all stakes', () => {
      const stakes: StakeInfo[] = [
        { address: 'SP1', amount: 1000 },
        { address: 'SP2', amount: 2000 },
        { address: 'SP3', amount: 3000 },
      ];
      expect(calculateTotalStaked(stakes)).toBe(6000);
    });

    it('returns 0 for empty array', () => {
      expect(calculateTotalStaked([])).toBe(0);
    });
  });

  describe('calculateWeightedVote', () => {
    it('returns positive weight for support', () => {
      expect(calculateWeightedVote(true, 100)).toBe(100);
    });

    it('returns negative weight for oppose', () => {
      expect(calculateWeightedVote(false, 100)).toBe(-100);
    });
  });

  describe('aggregateVotingStats', () => {
    const votes: VoteRecord[] = [
      { proposalId: 1, voter: 'SP1', support: true, weight: 100 },
      { proposalId: 1, voter: 'SP2', support: true, weight: 150 },
      { proposalId: 1, voter: 'SP3', support: false, weight: 75 },
    ];

    it('aggregates voting statistics', () => {
      const stats = aggregateVotingStats(votes);
      expect(stats.totalVoters).toBe(3);
      expect(stats.totalVotesFor).toBe(250);
      expect(stats.totalVotesAgainst).toBe(75);
    });

    it('handles empty votes', () => {
      const stats = aggregateVotingStats([]);
      expect(stats.totalVoters).toBe(0);
      expect(stats.totalVotesFor).toBe(0);
    });
  });

  describe('hasUserVoted', () => {
    const votes: VoteRecord[] = [
      { proposalId: 1, voter: 'SP1', support: true, weight: 100 },
      { proposalId: 2, voter: 'SP1', support: false, weight: 50 },
    ];

    it('returns true when user voted', () => {
      expect(hasUserVoted(votes, 'SP1', 1)).toBe(true);
    });

    it('returns false when user did not vote', () => {
      expect(hasUserVoted(votes, 'SP2', 1)).toBe(false);
    });
  });

  describe('findUserVote', () => {
    const votes: VoteRecord[] = [
      { proposalId: 1, voter: 'SP1', support: true, weight: 100 },
    ];

    it('finds user vote on proposal', () => {
      const vote = findUserVote(votes, 'SP1', 1);
      expect(vote).toEqual(votes[0]);
    });

    it('returns undefined when not found', () => {
      expect(findUserVote(votes, 'SP2', 1)).toBeUndefined();
    });
  });

  describe('calculateStakeForVotingPower', () => {
    it('calculates stake needed for voting power', () => {
      expect(calculateStakeForVotingPower(100)).toBe(10000);
      expect(calculateStakeForVotingPower(1000)).toBe(1000000);
    });

    it('returns 0 for zero power', () => {
      expect(calculateStakeForVotingPower(0)).toBe(0);
    });
  });

  describe('formatStxAmount', () => {
    it('formats microSTX to STX', () => {
      expect(formatStxAmount(1000000)).toBe('1.00 STX');
      expect(formatStxAmount(500000)).toBe('0.50 STX');
    });

    it('formats large amounts with K suffix', () => {
      expect(formatStxAmount(5000000000)).toBe('5000.00K STX');
    });

    it('formats very large amounts with M suffix', () => {
      expect(formatStxAmount(5000000000000)).toBe('5.00M STX');
    });
  });

  describe('isValidVoteWeight', () => {
    it('returns true for positive weights', () => {
      expect(isValidVoteWeight(1)).toBe(true);
      expect(isValidVoteWeight(1000000)).toBe(true);
    });

    it('returns false for non-positive weights', () => {
      expect(isValidVoteWeight(0)).toBe(false);
      expect(isValidVoteWeight(-100)).toBe(false);
    });
  });

  describe('calculateVoteMargin', () => {
    it('calculates vote differential', () => {
      expect(calculateVoteMargin(100, 30)).toBe(70);
      expect(calculateVoteMargin(50, 50)).toBe(0);
      expect(calculateVoteMargin(30, 100)).toBe(-70);
    });
  });
});

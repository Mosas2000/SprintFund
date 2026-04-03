import { describe, it, expect } from 'vitest';
import type {
  VoteInput,
  VoteRecord,
  UserVotingHistory,
  VoteWithProposal,
  VotingStats,
  StakeInfo,
  StakeInput,
  WithdrawStakeInput,
  MinStakeInfo,
  StakeTransactionResult,
  StakeHistoryEntry,
} from '../types';

describe('Voting Types', () => {
  describe('VoteInput', () => {
    it('represents a vote with proposal ID, support, and weight', () => {
      const vote: VoteInput = {
        proposalId: 1,
        support: true,
        weight: 1000,
      };

      expect(vote.proposalId).toBeGreaterThan(0);
      expect(typeof vote.support).toBe('boolean');
      expect(vote.weight).toBeGreaterThan(0);
    });
  });

  describe('VoteRecord', () => {
    it('represents a recorded vote with voter address', () => {
      const record: VoteRecord = {
        proposalId: 1,
        voter: 'SP123456789',
        support: true,
        weight: 500,
      };

      expect(record.voter).toMatch(/^S[PT]/);
      expect(record.support).toBe(true);
    });
  });

  describe('UserVotingHistory', () => {
    it('contains all votes for a user', () => {
      const history: UserVotingHistory = {
        address: 'SP987654321',
        totalVotes: 2,
        votes: [
          { proposalId: 1, voter: 'SP987654321', support: true, weight: 100 },
          { proposalId: 2, voter: 'SP987654321', support: false, weight: 200 },
        ],
      };

      expect(history.votes.length).toBe(history.totalVotes);
    });
  });

  describe('VoteWithProposal', () => {
    it('extends VoteRecord with proposal details', () => {
      const vote: VoteWithProposal = {
        proposalId: 1,
        voter: 'SP123456789',
        support: true,
        weight: 100,
        proposalTitle: 'Fund Development',
      };

      expect(vote.proposalTitle).toBeDefined();
    });
  });

  describe('VotingStats', () => {
    it('aggregates voting statistics', () => {
      const stats: VotingStats = {
        totalVoters: 150,
        totalVotesFor: 10000,
        totalVotesAgainst: 2000,
        participationRate: 75,
      };

      expect(stats.totalVoters).toBeGreaterThan(0);
      expect(stats.participationRate).toBeGreaterThanOrEqual(0);
      expect(stats.participationRate).toBeLessThanOrEqual(100);
    });
  });
});

describe('Stake Types', () => {
  describe('StakeInfo', () => {
    it('represents staked amount for an address', () => {
      const info: StakeInfo = {
        address: 'SP123456789',
        amount: 1000000,
      };

      expect(info.address).toMatch(/^S[PT]/);
      expect(info.amount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('StakeInput', () => {
    it('represents stake creation request', () => {
      const input: StakeInput = {
        amount: 5000000,
      };

      expect(input.amount).toBeGreaterThan(0);
    });
  });

  describe('WithdrawStakeInput', () => {
    it('represents stake withdrawal request', () => {
      const input: WithdrawStakeInput = {
        amount: 1000000,
      };

      expect(input.amount).toBeGreaterThan(0);
    });
  });

  describe('MinStakeInfo', () => {
    it('represents minimum stake requirement', () => {
      const info: MinStakeInfo = {
        amount: 10000000,
        currency: 'STX',
      };

      expect(info.currency).toBe('STX');
      expect(info.amount).toBeGreaterThan(0);
    });
  });

  describe('StakeTransactionResult', () => {
    it('represents successful stake or withdraw transaction', () => {
      const result: StakeTransactionResult = {
        txId: 'abc123def456',
        amount: 1000000,
        type: 'stake',
      };

      expect(['stake', 'withdraw']).toContain(result.type);
      expect(result.txId.length).toBeGreaterThan(0);
    });
  });

  describe('StakeHistoryEntry', () => {
    it('represents historical stake action', () => {
      const entry: StakeHistoryEntry = {
        timestamp: 1700000000,
        amount: 500000,
        type: 'withdraw',
        txId: 'xyz789abc123',
      };

      expect(['stake', 'withdraw']).toContain(entry.type);
      expect(entry.timestamp).toBeGreaterThan(0);
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  searchProposals,
  calculateProposalStats,
  buildVoterProfile,
  analyzeVotingPowerDistribution,
} from './governance-utils';
import type { Proposal, VoteRecord } from '../types';

const mockProposals: Proposal[] = [
  {
    id: 1,
    proposer: 'SP1',
    amount: 1000000,
    title: 'Fund Development',
    description: 'Fund development efforts',
    votesFor: 100,
    votesAgainst: 20,
    executed: false,
    createdAt: 1700000000,
  },
  {
    id: 2,
    proposer: 'SP2',
    amount: 500000,
    title: 'Marketing Campaign',
    description: 'Fund marketing',
    votesFor: 50,
    votesAgainst: 30,
    executed: true,
    createdAt: 1700000100,
  },
];

describe('Governance utilities', () => {
  describe('searchProposals', () => {
    it('returns all proposals for empty query', () => {
      const result = searchProposals(mockProposals, '');
      expect(result.proposals.length).toBe(2);
      expect(result.totalMatches).toBe(2);
    });

    it('searches by title', () => {
      const result = searchProposals(mockProposals, 'Development');
      expect(result.proposals).toHaveLength(1);
      expect(result.proposals[0].id).toBe(1);
    });

    it('searches by description', () => {
      const result = searchProposals(mockProposals, 'marketing');
      expect(result.proposals).toHaveLength(1);
    });

    it('searches by proposer address', () => {
      const result = searchProposals(mockProposals, 'SP1');
      expect(result.proposals).toHaveLength(1);
    });

    it('is case-insensitive', () => {
      const result = searchProposals(mockProposals, 'FUND');
      expect(result.totalMatches).toBeGreaterThan(0);
    });
  });

  describe('calculateProposalStats', () => {
    it('aggregates proposal statistics', () => {
      const stats = calculateProposalStats(mockProposals);

      expect(stats.totalProposals).toBe(2);
      expect(stats.activeCount).toBe(1);
      expect(stats.executedCount).toBe(1);
      expect(stats.totalFunded).toBe(1500000);
      expect(stats.averageVotes).toBeGreaterThan(0);
    });

    it('handles empty proposals', () => {
      const stats = calculateProposalStats([]);
      expect(stats.totalProposals).toBe(0);
      expect(stats.activeCount).toBe(0);
      expect(stats.averageVotes).toBe(0);
    });
  });

  describe('buildVoterProfile', () => {
    const votes: VoteRecord[] = [
      { proposalId: 1, voter: 'SP1', support: true, weight: 100 },
      { proposalId: 2, voter: 'SP1', support: true, weight: 150 },
      { proposalId: 3, voter: 'SP1', support: false, weight: 50 },
    ];

    it('builds voter profile from voting history', () => {
      const profile = buildVoterProfile('SP1', votes);

      expect(profile.address).toBe('SP1');
      expect(profile.voteCount).toBe(3);
      expect(profile.avgVoteWeight).toBeGreaterThan(0);
    });

    it('determines voting preference', () => {
      const forVotes: VoteRecord[] = [
        { proposalId: 1, voter: 'SP1', support: true, weight: 100 },
        { proposalId: 2, voter: 'SP1', support: true, weight: 100 },
      ];
      const profile = buildVoterProfile('SP1', forVotes);

      expect(profile.preferredSupport).toBe('for');
    });

    it('limits recent activity', () => {
      const manyVotes: VoteRecord[] = Array.from({ length: 20 }, (_, i) => ({
        proposalId: i,
        voter: 'SP1',
        support: true,
        weight: 100,
      }));

      const profile = buildVoterProfile('SP1', manyVotes, 5);
      expect(profile.recentActivity.length).toBe(5);
    });
  });

  describe('analyzeVotingPowerDistribution', () => {
    it('identifies top voters', () => {
      const votes: VoteRecord[] = [
        { proposalId: 1, voter: 'SP1', support: true, weight: 1000 },
        { proposalId: 1, voter: 'SP2', support: true, weight: 500 },
        { proposalId: 1, voter: 'SP3', support: false, weight: 200 },
      ];

      const result = analyzeVotingPowerDistribution(votes);
      expect(result.topVoters[0].address).toBe('SP1');
      expect(result.topVoters[0].totalWeight).toBe(1000);
    });

    it('calculates power concentration', () => {
      const votes: VoteRecord[] = [
        { proposalId: 1, voter: 'SP1', support: true, weight: 1000 },
        { proposalId: 1, voter: 'SP2', support: true, weight: 1000 },
      ];

      const result = analyzeVotingPowerDistribution(votes);
      expect(result.concentration).toBe(100);
    });

    it('handles empty votes', () => {
      const result = analyzeVotingPowerDistribution([]);
      expect(result.topVoters).toHaveLength(0);
      expect(result.concentration).toBe(0);
    });
  });
});

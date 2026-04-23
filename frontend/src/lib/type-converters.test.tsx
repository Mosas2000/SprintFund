import { describe, it, expect } from 'vitest';
import {
  convertRawToProposal,
  convertToProposalWithStats,
  convertRawToStake,
  convertRawToVote,
  createProposalPage,
  assertProposal,
  assertProposalPage,
  safeProposal,
  safeProposalPage,
} from './type-converters';
import type { RawProposal, RawStake, RawVote, Proposal } from '../types';

describe('Type converters', () => {
  describe('convertRawToProposal', () => {
    const rawProposal: RawProposal = {
      proposer: { value: 'SP123456' },
      amount: { value: 1000000 },
      title: { value: 'Test Proposal' },
      description: { value: 'A test proposal' },
      'votes-for': { value: 100 },
      'votes-against': { value: 25 },
      executed: { value: false },
      'created-at': { value: 1000000 },
      'voting-ends-at': { value: 1000432 },
      'execution-allowed-at': { value: 1000576 },
    };

    it('converts RawProposal to Proposal', () => {
      const proposal = convertRawToProposal(1, rawProposal);

      expect(proposal.id).toBe(1);
      expect(proposal.proposer).toBe('SP123456');
      expect(proposal.amount).toBe(1000000);
      expect(proposal.title).toBe('Test Proposal');
      expect(proposal.votesFor).toBe(100);
      expect(proposal.votesAgainst).toBe(25);
      expect(proposal.executed).toBe(false);
      expect(proposal.votingEndsAt).toBe(1000432);
      expect(proposal.executionAllowedAt).toBe(1000576);
    });

    it('handles missing wrapped fields', () => {
      const partial: Partial<RawProposal> = {
        proposer: { value: 'SP123456' },
      };

      const proposal = convertRawToProposal(1, partial as RawProposal);
      expect(proposal.proposer).toBe('SP123456');
      expect(proposal.amount).toBe(0);
    });
  });

  describe('convertToProposalWithStats', () => {
    const proposal: Proposal = {
      id: 1,
      proposer: 'SP123456',
      amount: 1000000,
      title: 'Test',
      description: 'Test proposal',
      votesFor: 100,
      votesAgainst: 25,
      executed: false,
      createdAt: 1000000,
      votingEndsAt: 1000432,
      executionAllowedAt: 1000576,
    };

    it('converts Proposal to ProposalWithStats', () => {
      const withStats = convertToProposalWithStats(proposal);

      expect(withStats.id).toBe(proposal.id);
      expect(withStats.totalVotes).toBe(125);
      expect(withStats.forPercentage).toBeGreaterThan(0);
      expect(withStats.daysOld).toBeGreaterThanOrEqual(0);
      expect(withStats.isActive).toBe(true);
    });
  });

  describe('convertRawToStake', () => {
    it('converts RawStake to StakeInfo', () => {
      const raw: RawStake = { amount: { value: 5000000 } };
      const stake = convertRawToStake('SP123456', raw);

      expect(stake.address).toBe('SP123456');
      expect(stake.amount).toBe(5000000);
    });
  });

  describe('convertRawToVote', () => {
    it('converts RawVote to VoteRecord', () => {
      const raw: RawVote = {
        weight: { value: 1000 },
        support: { value: true },
      };
      const vote = convertRawToVote(1, 'SP123456', raw);

      expect(vote.proposalId).toBe(1);
      expect(vote.voter).toBe('SP123456');
      expect(vote.weight).toBe(1000);
      expect(vote.support).toBe(true);
    });
  });

  describe('createProposalPage', () => {
    it('creates valid ProposalPage', () => {
      const proposals: Proposal[] = [];
      const page = createProposalPage(proposals, 100, 1, 10);

      expect(page.totalCount).toBe(100);
      expect(page.page).toBe(1);
      expect(page.pageSize).toBe(10);
      expect(page.totalPages).toBe(10);
    });

    it('clamps page to max pages', () => {
      const page = createProposalPage([], 50, 999, 10);
      expect(page.page).toBe(5);
    });
  });

  describe('assertProposal', () => {
    const validProposal: Proposal = {
      id: 1,
      proposer: 'SP123456',
      amount: 1000,
      title: 'Test',
      description: 'Test',
      votesFor: 10,
      votesAgainst: 2,
      executed: false,
      createdAt: 1000000,
      votingEndsAt: 1000432,
      executionAllowedAt: 1000576,
    };

    it('passes for valid Proposal', () => {
      expect(() => assertProposal(validProposal)).not.toThrow();
    });

    it('throws for invalid Proposal', () => {
      expect(() => assertProposal({})).toThrow();
      expect(() => assertProposal(null)).toThrow();
    });
  });

  describe('assertProposalPage', () => {
    it('passes for valid ProposalPage', () => {
      const page = {
        proposals: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      };
      expect(() => assertProposalPage(page)).not.toThrow();
    });

    it('throws for invalid ProposalPage', () => {
      expect(() => assertProposalPage({ proposals: 'invalid' })).toThrow();
    });
  });

  describe('safeProposal', () => {
    const validProposal: Proposal = {
      id: 1,
      proposer: 'SP123456',
      amount: 1000,
      title: 'Test',
      description: 'Test',
      votesFor: 10,
      votesAgainst: 2,
      executed: false,
      createdAt: 1000000,
      votingEndsAt: 1000432,
      executionAllowedAt: 1000576,
    };

    it('returns Proposal for valid value', () => {
      expect(safeProposal(validProposal)).toEqual(validProposal);
    });

    it('returns null for invalid value', () => {
      expect(safeProposal({})).toBeNull();
      expect(safeProposal(null)).toBeNull();
    });
  });

  describe('safeProposalPage', () => {
    it('returns ProposalPage for valid value', () => {
      const page = {
        proposals: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      };
      expect(safeProposalPage(page)).toEqual(page);
    });

    it('returns null for invalid value', () => {
      expect(safeProposalPage({})).toBeNull();
    });
  });
});

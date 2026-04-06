import { describe, it, expect } from 'vitest';
import {
  isValidProposal,
  isValidProposalPage,
  isValidStakeInfo,
  isValidVoteRecord,
  isValidPrincipal,
  isValidTxId,
  filterValidProposals,
  filterValidVotes,
  narrowProposal,
  narrowProposalPage,
  narrowStakeInfo,
} from './type-guards';
import type { Proposal, ProposalPage, StakeInfo, VoteRecord } from '../types';

const validProposal: Proposal = {
  id: 1,
  proposer: 'SP123456789',
  amount: 1000000,
  title: 'Test Proposal',
  description: 'Test description',
  votesFor: 100,
  votesAgainst: 25,
  executed: false,
  createdAt: 1700000000,
};

describe('Type guards', () => {
  describe('isValidProposal', () => {
    it('returns true for valid Proposal', () => {
      expect(isValidProposal(validProposal)).toBe(true);
    });

    it('returns false for missing fields', () => {
      expect(isValidProposal({ ...validProposal, id: undefined })).toBe(false);
      expect(isValidProposal({ ...validProposal, title: '' })).toBe(false);
    });

    it('returns false for invalid types', () => {
      expect(isValidProposal({ ...validProposal, amount: 'invalid' })).toBe(false);
      expect(isValidProposal({ ...validProposal, executed: 'no' })).toBe(false);
    });

    it('returns false for null or undefined', () => {
      expect(isValidProposal(null)).toBeFalsy();
      expect(isValidProposal(undefined)).toBeFalsy();
    });
  });

  describe('isValidProposalPage', () => {
    const validPage: ProposalPage = {
      proposals: [validProposal],
      totalCount: 100,
      page: 1,
      pageSize: 10,
      totalPages: 10,
    };

    it('returns true for valid ProposalPage', () => {
      expect(isValidProposalPage(validPage)).toBe(true);
    });

    it('returns false for invalid proposals array', () => {
      expect(isValidProposalPage({ ...validPage, proposals: 'not-array' })).toBe(false);
    });

    it('returns false for invalid pagination values', () => {
      expect(isValidProposalPage({ ...validPage, page: 0 })).toBe(false);
      expect(isValidProposalPage({ ...validPage, pageSize: -1 })).toBe(false);
    });
  });

  describe('isValidStakeInfo', () => {
    const validStake: StakeInfo = {
      address: 'SP123456789',
      amount: 5000000,
    };

    it('returns true for valid StakeInfo', () => {
      expect(isValidStakeInfo(validStake)).toBe(true);
    });

    it('returns false for missing fields', () => {
      expect(isValidStakeInfo({ address: 'SP123' })).toBe(false);
      expect(isValidStakeInfo({ amount: 1000 })).toBe(false);
    });

    it('returns false for invalid types', () => {
      expect(isValidStakeInfo({ ...validStake, amount: 'invalid' })).toBe(false);
    });
  });

  describe('isValidVoteRecord', () => {
    const validVote: VoteRecord = {
      proposalId: 1,
      voter: 'SP123456789',
      support: true,
      weight: 100,
    };

    it('returns true for valid VoteRecord', () => {
      expect(isValidVoteRecord(validVote)).toBe(true);
    });

    it('returns false for invalid weight', () => {
      expect(isValidVoteRecord({ ...validVote, weight: 0 })).toBe(false);
      expect(isValidVoteRecord({ ...validVote, weight: -100 })).toBe(false);
    });

    it('returns false for invalid support', () => {
      expect(isValidVoteRecord({ ...validVote, support: 'yes' })).toBe(false);
    });
  });

  describe('isValidPrincipal', () => {
    it('accepts valid Stacks addresses', () => {
      expect(isValidPrincipal('SP3NJ3HTPVJVTG2HZHBNVGF37WXVWQDP8T0E3GNJG')).toBe(true);
      expect(isValidPrincipal('SPMGWYY7K6BN5P5AW4J50R5RNHB9QNEQVVVNN3MYX')).toBe(true);
      expect(isValidPrincipal('ST3NJ3HTPVJVTG2HZHBNVGF37WXVWQDP8T0E3GNJG')).toBe(true);
    });

    it('rejects invalid addresses', () => {
      expect(isValidPrincipal('INVALID')).toBe(false);
      expect(isValidPrincipal('sp123')).toBe(false);
      expect(isValidPrincipal('')).toBe(false);
      expect(isValidPrincipal(123)).toBe(false);
    });
  });

  describe('isValidTxId', () => {
    it('accepts valid transaction IDs', () => {
      const validTxId = 'a'.repeat(64);
      expect(isValidTxId(validTxId)).toBe(true);
    });

    it('rejects invalid transaction IDs', () => {
      expect(isValidTxId('short')).toBe(false);
      expect(isValidTxId('z' + 'a'.repeat(63))).toBe(false);
      expect(isValidTxId('')).toBe(false);
    });
  });

  describe('filterValidProposals', () => {
    it('filters to only valid proposals', () => {
      const proposals = [validProposal, { invalid: true }, null, validProposal];
      const filtered = filterValidProposals(proposals);
      expect(filtered).toHaveLength(2);
      expect(filtered[0]).toEqual(validProposal);
    });

    it('returns empty array for non-array input', () => {
      expect(filterValidProposals(null as unknown as unknown[])).toEqual([]);
      expect(filterValidProposals('not-array' as unknown as unknown[])).toEqual([]);
    });
  });

  describe('filterValidVotes', () => {
    const validVote: VoteRecord = {
      proposalId: 1,
      voter: 'SP123456789',
      support: true,
      weight: 100,
    };

    it('filters to only valid votes', () => {
      const votes = [validVote, { invalid: true }, validVote];
      const filtered = filterValidVotes(votes);
      expect(filtered).toHaveLength(2);
    });
  });

  describe('narrowProposal', () => {
    it('returns Proposal when valid', () => {
      expect(narrowProposal(validProposal)).toEqual(validProposal);
    });

    it('returns null when invalid', () => {
      expect(narrowProposal({})).toBeNull();
      expect(narrowProposal(null)).toBeNull();
    });
  });

  describe('narrowProposalPage', () => {
    it('returns ProposalPage when valid', () => {
      const page: ProposalPage = {
        proposals: [validProposal],
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      };
      expect(narrowProposalPage(page)).toEqual(page);
    });

    it('returns null when invalid', () => {
      expect(narrowProposalPage({})).toBeNull();
    });
  });

  describe('narrowStakeInfo', () => {
    it('returns StakeInfo when valid', () => {
      const stake: StakeInfo = { address: 'SP123456789', amount: 1000 };
      expect(narrowStakeInfo(stake)).toEqual(stake);
    });

    it('returns null when invalid', () => {
      expect(narrowStakeInfo({})).toBeNull();
    });
  });
});

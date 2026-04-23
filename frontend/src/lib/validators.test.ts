import { describe, it, expect } from 'vitest';
import {
  unwrapClarityValue,
  validateRawProposal,
  rawProposalToProposal,
  validateRawStake,
  validateRawVote,
  validateCreateProposalInput,
  validateProposalCount,
  validateStxAmount,
  isProposal,
  isProposalArray,
} from './validators';
import type { RawProposal } from '../types/contract';
import type { Proposal } from '../types/proposal';

describe('unwrapClarityValue', () => {
  it('returns null for null or undefined', () => {
    expect(unwrapClarityValue(null)).toBeNull();
    expect(unwrapClarityValue(undefined)).toBeNull();
  });

  it('unwraps values from { value: T } object', () => {
    expect(unwrapClarityValue({ value: 'test' })).toBe('test');
    expect(unwrapClarityValue({ value: 42 })).toBe(42);
    expect(unwrapClarityValue({ value: true })).toBe(true);
  });

  it('returns direct values without unwrapping', () => {
    expect(unwrapClarityValue('direct')).toBe('direct');
    expect(unwrapClarityValue(99)).toBe(99);
    expect(unwrapClarityValue(false)).toBe(false);
  });
});

describe('validateRawProposal', () => {
  const validRawProposal = {
    proposer: { value: 'SP123456' },
    amount: { value: 1000 },
    title: { value: 'Test Proposal' },
    description: { value: 'A test proposal' },
    'votes-for': { value: 5 },
    'votes-against': { value: 2 },
    executed: { value: false },
    'created-at': { value: 1000000 },
    'voting-ends-at': { value: 1000432 },
    'execution-allowed-at': { value: 1000576 },
  };

  it('returns null for invalid input', () => {
    expect(validateRawProposal(null)).toBeNull();
    expect(validateRawProposal(undefined)).toBeNull();
    expect(validateRawProposal('string')).toBeNull();
    expect(validateRawProposal({})).toBeNull();
  });

  it('validates a valid raw proposal', () => {
    const result = validateRawProposal(validRawProposal);
    expect(result).not.toBeNull();
  });

  it('returns null if required fields are missing or invalid', () => {
    const invalid = { ...validRawProposal, proposer: null };
    expect(validateRawProposal(invalid)).toBeNull();
  });

  it('accepts unwrapped values', () => {
    const unwrapped = {
      proposer: 'SP123456',
      amount: 1000,
      title: 'Test',
      description: 'Description',
      'votes-for': 10,
      'votes-against': 5,
      executed: false,
      'created-at': 1000000,
      'voting-ends-at': 1000432,
      'execution-allowed-at': 1000576,
    };
    const result = validateRawProposal(unwrapped);
    expect(result).not.toBeNull();
  });
});

describe('rawProposalToProposal', () => {
  const rawProposal: RawProposal = {
    proposer: { value: 'SP123456' },
    amount: { value: 5000 },
    title: { value: 'Title' },
    description: { value: 'Desc' },
    'votes-for': { value: 10 },
    'votes-against': { value: 3 },
    executed: { value: true },
    'created-at': { value: 999999 },
    'voting-ends-at': { value: 1000431 },
    'execution-allowed-at': { value: 1000431 },
  };

  it('converts RawProposal to Proposal', () => {
    const proposal = rawProposalToProposal(1, rawProposal);
    expect(proposal.id).toBe(1);
    expect(proposal.proposer).toBe('SP123456');
    expect(proposal.amount).toBe(5000);
    expect(proposal.title).toBe('Title');
    expect(proposal.description).toBe('Desc');
    expect(proposal.votesFor).toBe(10);
    expect(proposal.votesAgainst).toBe(3);
    expect(proposal.executed).toBe(true);
    expect(proposal.createdAt).toBe(999999);
    expect(proposal.votingEndsAt).toBe(1000431);
    expect(proposal.executionAllowedAt).toBe(1000431);
  });
});

describe('validateCreateProposalInput', () => {
  it('returns null for invalid input', () => {
    expect(validateCreateProposalInput(null)).toBeNull();
    expect(validateCreateProposalInput({})).toBeNull();
  });

  it('validates valid create proposal input', () => {
    const valid = {
      title: 'New Proposal',
      description: 'This is a longer description with details',
      amount: 1000000,
    };
    const result = validateCreateProposalInput(valid);
    expect(result).toEqual(valid);
  });

  it('rejects title that is too short', () => {
    const invalid = { title: 'ab', description: 'Long enough description', amount: 1000 };
    expect(validateCreateProposalInput(invalid)).toBeNull();
  });

  it('rejects description that is too short', () => {
    const invalid = { title: 'Valid Title', description: 'short', amount: 1000 };
    expect(validateCreateProposalInput(invalid)).toBeNull();
  });

  it('rejects non-positive amounts', () => {
    const invalid = { title: 'Valid', description: 'Long enough description', amount: 0 };
    expect(validateCreateProposalInput(invalid)).toBeNull();
  });
});

describe('validateProposalCount', () => {
  it('returns null for invalid values', () => {
    expect(validateProposalCount(null)).toBeNull();
    expect(validateProposalCount('not-a-number')).toBeNull();
    expect(validateProposalCount(-1)).toBeNull();
  });

  it('returns count for valid values', () => {
    expect(validateProposalCount(42)).toBe(42);
    expect(validateProposalCount({ value: 10 })).toBe(10);
    expect(validateProposalCount(0)).toBe(0);
  });
});

describe('validateStxAmount', () => {
  it('returns null for invalid values', () => {
    expect(validateStxAmount(null)).toBeNull();
    expect(validateStxAmount('123')).toBeNull();
    expect(validateStxAmount(-100)).toBeNull();
  });

  it('returns amount for valid values', () => {
    expect(validateStxAmount(1000000)).toBe(1000000);
    expect(validateStxAmount(0)).toBe(0);
    expect(validateStxAmount(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('returns null for too large amounts', () => {
    expect(validateStxAmount(Number.MAX_VALUE)).toBeNull();
  });
});

describe('isProposal', () => {
  const validProposal: Proposal = {
    id: 1,
    proposer: 'SP123456',
    amount: 1000,
    title: 'Title',
    description: 'Description',
    votesFor: 5,
    votesAgainst: 2,
    executed: false,
    createdAt: 1000000,
    votingEndsAt: 1000432,
    executionAllowedAt: 1000576,
  };

  it('returns true for valid Proposal objects', () => {
    expect(isProposal(validProposal)).toBe(true);
  });

  it('returns false for objects missing required fields', () => {
    const invalid = { ...validProposal, id: undefined };
    expect(isProposal(invalid)).toBe(false);
  });

  it('returns false for non-objects', () => {
    expect(isProposal(null)).toBe(false);
    expect(isProposal('string')).toBe(false);
    expect(isProposal(123)).toBe(false);
  });
});

describe('isProposalArray', () => {
  const validProposal: Proposal = {
    id: 1,
    proposer: 'SP123456',
    amount: 1000,
    title: 'Title',
    description: 'Description',
    votesFor: 5,
    votesAgainst: 2,
    executed: false,
    createdAt: 1000000,
    votingEndsAt: 1000432,
    executionAllowedAt: 1000576,
  };

  it('returns true for arrays of valid Proposals', () => {
    expect(isProposalArray([validProposal])).toBe(true);
    expect(isProposalArray([validProposal, validProposal])).toBe(true);
  });

  it('returns true for empty array', () => {
    expect(isProposalArray([])).toBe(true);
  });

  it('returns false for arrays containing invalid Proposals', () => {
    expect(isProposalArray([validProposal, { ...validProposal, id: 'invalid' }])).toBe(false);
  });

  it('returns false for non-arrays', () => {
    expect(isProposalArray(null)).toBe(false);
    expect(isProposalArray('array')).toBe(false);
  });
});

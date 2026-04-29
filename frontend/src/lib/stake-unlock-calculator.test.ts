import { describe, it, expect } from 'vitest';
import {
  calculateUnlockEstimates,
  formatUnlockTime,
  getTotalUnlockingAmount,
  getNextUnlockEstimate,
} from './stake-unlock-calculator';
import type { Proposal } from '../types';
import type { VoteCostInfo } from '../types/stake';

const createMockProposal = (overrides: Partial<Proposal> = {}): Proposal => ({
  id: 1,
  proposer: 'SP1ABC',
  amount: 1000000,
  title: 'Test',
  description: 'Test',
  votesFor: 0,
  votesAgainst: 0,
  executed: false,
  createdAt: 1000,
  votingEndsAt: 1432,
  ...overrides,
});

describe('calculateUnlockEstimates', () => {
  it('calculates unlock estimates for active votes', () => {
    const voteCosts: VoteCostInfo[] = [
      { proposalId: 1, cost: 100, weight: 10 },
      { proposalId: 2, cost: 400, weight: 20 },
    ];

    const proposals = [
      createMockProposal({ id: 1, votingEndsAt: 1500 }),
      createMockProposal({ id: 2, votingEndsAt: 1600 }),
    ];

    const estimates = calculateUnlockEstimates(voteCosts, proposals, 1400);

    expect(estimates).toHaveLength(2);
    expect(estimates[0].blocksRemaining).toBe(100);
    expect(estimates[1].blocksRemaining).toBe(200);
  });

  it('sorts estimates by blocks remaining', () => {
    const voteCosts: VoteCostInfo[] = [
      { proposalId: 1, cost: 100, weight: 10 },
      { proposalId: 2, cost: 400, weight: 20 },
    ];

    const proposals = [
      createMockProposal({ id: 1, votingEndsAt: 1600 }),
      createMockProposal({ id: 2, votingEndsAt: 1500 }),
    ];

    const estimates = calculateUnlockEstimates(voteCosts, proposals, 1400);

    expect(estimates[0].proposalId).toBe(2);
    expect(estimates[1].proposalId).toBe(1);
  });

  it('excludes executed proposals', () => {
    const voteCosts: VoteCostInfo[] = [
      { proposalId: 1, cost: 100, weight: 10 },
    ];

    const proposals = [
      createMockProposal({ id: 1, executed: true }),
    ];

    const estimates = calculateUnlockEstimates(voteCosts, proposals, 1400);

    expect(estimates).toHaveLength(0);
  });
});

describe('formatUnlockTime', () => {
  it('formats available now', () => {
    const estimate = {
      proposalId: 1,
      amount: 100,
      votingEndsAt: 1500,
      blocksRemaining: 0,
      estimatedMinutes: 0,
      estimatedHours: 0,
    };

    expect(formatUnlockTime(estimate)).toBe('Available now');
  });

  it('formats days and hours', () => {
    const estimate = {
      proposalId: 1,
      amount: 100,
      votingEndsAt: 1500,
      blocksRemaining: 200,
      estimatedMinutes: 2000,
      estimatedHours: 33,
    };

    expect(formatUnlockTime(estimate)).toBe('1d 9h');
  });

  it('formats hours only', () => {
    const estimate = {
      proposalId: 1,
      amount: 100,
      votingEndsAt: 1500,
      blocksRemaining: 50,
      estimatedMinutes: 500,
      estimatedHours: 8,
    };

    expect(formatUnlockTime(estimate)).toBe('8h');
  });
});

describe('getTotalUnlockingAmount', () => {
  it('sums all unlocking amounts', () => {
    const estimates = [
      {
        proposalId: 1,
        amount: 100,
        votingEndsAt: 1500,
        blocksRemaining: 100,
        estimatedMinutes: 1000,
        estimatedHours: 16,
      },
      {
        proposalId: 2,
        amount: 400,
        votingEndsAt: 1600,
        blocksRemaining: 200,
        estimatedMinutes: 2000,
        estimatedHours: 33,
      },
    ];

    expect(getTotalUnlockingAmount(estimates)).toBe(500);
  });
});

describe('getNextUnlockEstimate', () => {
  it('returns first estimate', () => {
    const estimates = [
      {
        proposalId: 1,
        amount: 100,
        votingEndsAt: 1500,
        blocksRemaining: 100,
        estimatedMinutes: 1000,
        estimatedHours: 16,
      },
    ];

    const next = getNextUnlockEstimate(estimates);
    expect(next?.proposalId).toBe(1);
  });

  it('returns null for empty array', () => {
    expect(getNextUnlockEstimate([])).toBeNull();
  });
});

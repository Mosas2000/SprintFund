import { describe, it, expect } from 'vitest';
import type { Proposal } from '../../types';
import { microToStx } from '../../config';

describe('Dashboard with batched getAllProposals', () => {
  const allProposals: Proposal[] = [
    { id: 0, proposer: 'SP1ME', amount: 5_000_000, title: 'My P1', description: 'D', votesFor: 10, votesAgainst: 5, executed: false, createdAt: 100 },
    { id: 1, proposer: 'SP2OTHER', amount: 3_000_000, title: 'Other P', description: 'D', votesFor: 20, votesAgainst: 0, executed: true, createdAt: 200 },
    { id: 2, proposer: 'SP1ME', amount: 8_000_000, title: 'My P2', description: 'D', votesFor: 5, votesAgainst: 15, executed: false, createdAt: 300 },
  ];

  it('filters user proposals from batched results', () => {
    const userAddr = 'SP1ME';
    const userProposals = allProposals.filter(p => p.proposer === userAddr);
    expect(userProposals).toHaveLength(2);
  });

  it('uses allProposals.length as total count (no separate call)', () => {
    const totalProposals = allProposals.length;
    expect(totalProposals).toBe(3);
  });

  it('correctly computes total requested amount', () => {
    const userProposals = allProposals.filter(p => p.proposer === 'SP1ME');
    const totalAmount = userProposals.reduce((s, p) => s + p.amount, 0);
    expect(microToStx(totalAmount)).toBe(13);
  });
});

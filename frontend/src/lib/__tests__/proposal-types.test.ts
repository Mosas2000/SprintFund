import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import type { Proposal } from '../../types';

describe('Proposal type shape', () => {
  const validProposal: Proposal = {
    id: 0,
    proposer: 'SP1EXAMPLE',
    amount: 1000000,
    title: 'Test',
    description: 'Test description',
    votesFor: 10,
    votesAgainst: 5,
    executed: false,
    createdAt: 1700000000,
  };

  it('has numeric id', () => {
    expect(typeof validProposal.id).toBe('number');
  });

  it('has string proposer', () => {
    expect(typeof validProposal.proposer).toBe('string');
  });

  it('has numeric amount', () => {
    expect(typeof validProposal.amount).toBe('number');
  });

  it('has string title', () => {
    expect(typeof validProposal.title).toBe('string');
  });

  it('has string description', () => {
    expect(typeof validProposal.description).toBe('string');
  });

  it('has numeric votesFor', () => {
    expect(typeof validProposal.votesFor).toBe('number');
  });

  it('has numeric votesAgainst', () => {
    expect(typeof validProposal.votesAgainst).toBe('number');
  });

  it('has boolean executed', () => {
    expect(typeof validProposal.executed).toBe('boolean');
  });

  it('has numeric createdAt', () => {
    expect(typeof validProposal.createdAt).toBe('number');
  });

  it('id can be zero', () => {
    expect(validProposal.id).toBe(0);
  });
});

describe('Proposal filtering logic', () => {
  const proposals: Proposal[] = [
    { id: 0, proposer: 'SP1', amount: 1000, title: 'A', description: 'D', votesFor: 10, votesAgainst: 5, executed: false, createdAt: 100 },
    { id: 1, proposer: 'SP2', amount: 2000, title: 'B', description: 'D', votesFor: 20, votesAgainst: 0, executed: true, createdAt: 200 },
    { id: 2, proposer: 'SP1', amount: 3000, title: 'C', description: 'D', votesFor: 5, votesAgainst: 15, executed: false, createdAt: 300 },
  ];

  it('filters active proposals', () => {
    const active = proposals.filter(p => !p.executed);
    expect(active).toHaveLength(2);
  });

  it('filters executed proposals', () => {
    const executed = proposals.filter(p => p.executed);
    expect(executed).toHaveLength(1);
    expect(executed[0].id).toBe(1);
  });

  it('filters by proposer address', () => {
    const byProposer = proposals.filter(p => p.proposer === 'SP1');
    expect(byProposer).toHaveLength(2);
  });

  it('returns all when no filter applied', () => {
    const all = proposals.filter(() => true);
    expect(all).toHaveLength(3);
  });

  it('sorts by createdAt descending', () => {
    const sorted = [...proposals].sort((a, b) => b.createdAt - a.createdAt);
    expect(sorted[0].id).toBe(2);
    expect(sorted[2].id).toBe(0);
  });
});

describe('Proposal vote calculations', () => {
  it('calculates total votes', () => {
    const proposal: Proposal = {
      id: 0, proposer: 'SP1', amount: 1000, title: 'T', description: 'D',
      votesFor: 75, votesAgainst: 25, executed: false, createdAt: 100,
    };
    const total = proposal.votesFor + proposal.votesAgainst;
    expect(total).toBe(100);
  });

  it('calculates approval rate', () => {
    const proposal: Proposal = {
      id: 0, proposer: 'SP1', amount: 1000, title: 'T', description: 'D',
      votesFor: 60, votesAgainst: 40, executed: false, createdAt: 100,
    };
    const total = proposal.votesFor + proposal.votesAgainst;
    const rate = total > 0 ? (proposal.votesFor / total) * 100 : 0;
    expect(rate).toBe(60);
  });

  it('handles zero total votes', () => {
    const proposal: Proposal = {
      id: 0, proposer: 'SP1', amount: 1000, title: 'T', description: 'D',
      votesFor: 0, votesAgainst: 0, executed: false, createdAt: 100,
    };
    const total = proposal.votesFor + proposal.votesAgainst;
    const rate = total > 0 ? (proposal.votesFor / total) * 100 : 0;
    expect(rate).toBe(0);
  });
});

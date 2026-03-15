import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import type { Proposal } from '../../types';

describe('Proposals page filter logic', () => {
  const proposals: Proposal[] = [
    { id: 0, proposer: 'SP1', amount: 1_000_000, title: 'Community Fund', description: 'D1', votesFor: 50, votesAgainst: 10, executed: false, createdAt: 100 },
    { id: 1, proposer: 'SP2', amount: 2_000_000, title: 'Dev Grant', description: 'D2', votesFor: 30, votesAgainst: 20, executed: true, createdAt: 200 },
    { id: 2, proposer: 'SP3', amount: 500_000, title: 'Marketing Push', description: 'D3', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 300 },
  ];

  it('all filter returns all proposals', () => {
    const filtered = proposals;
    expect(filtered).toHaveLength(3);
  });

  it('active filter excludes executed proposals', () => {
    const filtered = proposals.filter(p => !p.executed);
    expect(filtered).toHaveLength(2);
    expect(filtered.every(p => !p.executed)).toBe(true);
  });

  it('executed filter includes only executed proposals', () => {
    const filtered = proposals.filter(p => p.executed);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(1);
  });

  it('search filter matches title', () => {
    const query = 'community';
    const filtered = proposals.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Community Fund');
  });

  it('search filter matches description', () => {
    const query = 'D2';
    const filtered = proposals.filter(p =>
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(1);
  });

  it('search filter is case insensitive', () => {
    const query = 'DEV GRANT';
    const filtered = proposals.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
  });

  it('search filter with no matches returns empty array', () => {
    const query = 'nonexistent';
    const filtered = proposals.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(filtered).toHaveLength(0);
  });

  it('combined filter: active + search', () => {
    const query = 'fund';
    const filtered = proposals.filter(p =>
      !p.executed && p.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Community Fund');
  });
});

describe('Proposals page sorting logic', () => {
  const proposals: Proposal[] = [
    { id: 0, proposer: 'SP1', amount: 1_000_000, title: 'A', description: 'D', votesFor: 50, votesAgainst: 10, executed: false, createdAt: 100 },
    { id: 1, proposer: 'SP2', amount: 5_000_000, title: 'B', description: 'D', votesFor: 30, votesAgainst: 20, executed: false, createdAt: 300 },
    { id: 2, proposer: 'SP3', amount: 2_000_000, title: 'C', description: 'D', votesFor: 80, votesAgainst: 5, executed: false, createdAt: 200 },
  ];

  it('sorts by newest first (default)', () => {
    const sorted = [...proposals].sort((a, b) => b.createdAt - a.createdAt);
    expect(sorted[0].id).toBe(1);
    expect(sorted[2].id).toBe(0);
  });

  it('sorts by oldest first', () => {
    const sorted = [...proposals].sort((a, b) => a.createdAt - b.createdAt);
    expect(sorted[0].id).toBe(0);
    expect(sorted[2].id).toBe(1);
  });

  it('sorts by most votes', () => {
    const sorted = [...proposals].sort((a, b) =>
      (b.votesFor + b.votesAgainst) - (a.votesFor + a.votesAgainst)
    );
    expect(sorted[0].id).toBe(2);
  });

  it('sorts by highest amount', () => {
    const sorted = [...proposals].sort((a, b) => b.amount - a.amount);
    expect(sorted[0].id).toBe(1);
    expect(sorted[0].amount).toBe(5_000_000);
  });
});

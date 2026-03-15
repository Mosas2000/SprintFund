import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import type { Proposal } from '../../types';
import { microToStx, formatStx } from '../../config';

describe('Dashboard proposal grouping logic', () => {
  const proposals: Proposal[] = [
    { id: 0, proposer: 'SP1ME', amount: 5_000_000, title: 'My P1', description: 'D', votesFor: 10, votesAgainst: 5, executed: false, createdAt: 100 },
    { id: 1, proposer: 'SP2OTHER', amount: 3_000_000, title: 'Other P', description: 'D', votesFor: 20, votesAgainst: 0, executed: true, createdAt: 200 },
    { id: 2, proposer: 'SP1ME', amount: 8_000_000, title: 'My P2', description: 'D', votesFor: 5, votesAgainst: 15, executed: false, createdAt: 300 },
    { id: 3, proposer: 'SP1ME', amount: 2_000_000, title: 'My P3', description: 'D', votesFor: 0, votesAgainst: 0, executed: true, createdAt: 400 },
  ];

  it('filters proposals by user address', () => {
    const myProposals = proposals.filter(p => p.proposer === 'SP1ME');
    expect(myProposals).toHaveLength(3);
  });

  it('counts active proposals by user', () => {
    const myActive = proposals.filter(p => p.proposer === 'SP1ME' && !p.executed);
    expect(myActive).toHaveLength(2);
  });

  it('counts executed proposals by user', () => {
    const myExecuted = proposals.filter(p => p.proposer === 'SP1ME' && p.executed);
    expect(myExecuted).toHaveLength(1);
  });

  it('calculates total requested amount by user', () => {
    const total = proposals
      .filter(p => p.proposer === 'SP1ME')
      .reduce((sum, p) => sum + p.amount, 0);
    expect(total).toBe(15_000_000);
    expect(microToStx(total)).toBe(15);
  });

  it('has no proposals for unknown address', () => {
    const unknown = proposals.filter(p => p.proposer === 'SP999');
    expect(unknown).toHaveLength(0);
  });
});

describe('Dashboard balance display logic', () => {
  it('formats zero balance', () => {
    expect(formatStx(0)).toBe('0.00');
  });

  it('formats typical balance', () => {
    const result = formatStx(25_500_000);
    expect(result).toContain('25');
  });

  it('converts micro balance for display', () => {
    const microBalance = 100_000_000;
    const stx = microToStx(microBalance);
    expect(stx).toBe(100);
  });
});

describe('Dashboard stake display logic', () => {
  it('shows stake as STX', () => {
    const stakeMicro = 50_000_000;
    const stakeStx = microToStx(stakeMicro);
    expect(stakeStx).toBe(50);
  });

  it('shows zero stake', () => {
    const stakeMicro = 0;
    const stakeStx = microToStx(stakeMicro);
    expect(stakeStx).toBe(0);
  });

  it('formats stake for display', () => {
    const result = formatStx(10_000_000);
    expect(result).toContain('10');
  });
});

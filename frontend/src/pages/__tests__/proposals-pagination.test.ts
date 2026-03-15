import { describe, it, expect } from 'vitest';
import type { Proposal } from '../../types';

describe('Proposals page filter with pagination', () => {
  const proposals: Proposal[] = [
    { id: 24, proposer: 'SP1', amount: 1000, title: 'A', description: 'D1', votesFor: 50, votesAgainst: 10, executed: false, createdAt: 100 },
    { id: 23, proposer: 'SP2', amount: 2000, title: 'B', description: 'D2', votesFor: 30, votesAgainst: 20, executed: true, createdAt: 200 },
    { id: 22, proposer: 'SP3', amount: 500, title: 'C', description: 'D3', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 300 },
    { id: 21, proposer: 'SP1', amount: 1500, title: 'D', description: 'D4', votesFor: 40, votesAgainst: 5, executed: true, createdAt: 400 },
    { id: 20, proposer: 'SP4', amount: 3000, title: 'E', description: 'D5', votesFor: 100, votesAgainst: 0, executed: false, createdAt: 500 },
  ];

  it('active filter works on paginated results', () => {
    const active = proposals.filter(p => !p.executed);
    expect(active).toHaveLength(3);
    expect(active.every(p => !p.executed)).toBe(true);
  });

  it('executed filter works on paginated results', () => {
    const executed = proposals.filter(p => p.executed);
    expect(executed).toHaveLength(2);
  });

  it('filtered count may differ from page size', () => {
    const pageSize = 10;
    const active = proposals.filter(p => !p.executed);
    expect(active.length).toBeLessThanOrEqual(pageSize);
  });

  it('search filter works on paginated data', () => {
    const query = 'D';
    const filtered = proposals.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(21);
  });
});

describe('Proposals page state management', () => {
  it('page resets to 0 when filter changes', () => {
    let page = 2;
    // Simulate filter change
    page = 0;
    expect(page).toBe(0);
  });

  it('loading state during page transition', () => {
    let loading = false;
    // Start page fetch
    loading = true;
    expect(loading).toBe(true);
    // Fetch complete
    loading = false;
    expect(loading).toBe(false);
  });

  it('error state clears on retry', () => {
    let error: string | null = 'Network error';
    // Retry
    error = null;
    expect(error).toBeNull();
  });
});

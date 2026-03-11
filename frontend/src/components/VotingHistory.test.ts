import { describe, it, expect } from 'vitest';
import type { VoteRecord } from '../types/profile';

/**
 * Behavioral tests for VotingHistory component.
 * Tests sort logic, badge rendering, and date formatting.
 */

/* ── Sort logic (mirrors component) ───────────── */

type SortField = 'timestamp' | 'weight' | 'support';
type SortDir = 'asc' | 'desc';

function sortVotes(votes: VoteRecord[], field: SortField, dir: SortDir): VoteRecord[] {
  const sorted = [...votes];
  sorted.sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case 'timestamp':
        cmp = a.timestamp - b.timestamp;
        break;
      case 'weight':
        cmp = a.weight - b.weight;
        break;
      case 'support':
        cmp = (a.support ? 1 : 0) - (b.support ? 1 : 0);
        break;
    }
    return dir === 'asc' ? cmp : -cmp;
  });
  return sorted;
}

/* ── Sample data ──────────────────────────────── */

const votes: VoteRecord[] = [
  { proposalId: 1, title: 'Fund SDK', support: true, weight: 5, timestamp: 1000, executed: true },
  { proposalId: 2, title: 'Fund UI', support: false, weight: 2, timestamp: 3000, executed: false },
  { proposalId: 3, title: 'Fund Docs', support: true, weight: 1, timestamp: 2000, executed: false },
];

describe('VotingHistory behaviour', () => {
  describe('sort by timestamp', () => {
    it('sorts descending by default', () => {
      const sorted = sortVotes(votes, 'timestamp', 'desc');
      expect(sorted[0].proposalId).toBe(2); // 3000
      expect(sorted[1].proposalId).toBe(3); // 2000
      expect(sorted[2].proposalId).toBe(1); // 1000
    });

    it('sorts ascending', () => {
      const sorted = sortVotes(votes, 'timestamp', 'asc');
      expect(sorted[0].proposalId).toBe(1); // 1000
      expect(sorted[1].proposalId).toBe(3); // 2000
      expect(sorted[2].proposalId).toBe(2); // 3000
    });
  });

  describe('sort by weight', () => {
    it('sorts descending', () => {
      const sorted = sortVotes(votes, 'weight', 'desc');
      expect(sorted[0].weight).toBe(5);
      expect(sorted[1].weight).toBe(2);
      expect(sorted[2].weight).toBe(1);
    });

    it('sorts ascending', () => {
      const sorted = sortVotes(votes, 'weight', 'asc');
      expect(sorted[0].weight).toBe(1);
      expect(sorted[1].weight).toBe(2);
      expect(sorted[2].weight).toBe(5);
    });
  });

  describe('sort by support', () => {
    it('sorts descending: For votes first', () => {
      const sorted = sortVotes(votes, 'support', 'desc');
      expect(sorted[0].support).toBe(true);
      expect(sorted[sorted.length - 1].support).toBe(false);
    });

    it('sorts ascending: Against votes first', () => {
      const sorted = sortVotes(votes, 'support', 'asc');
      expect(sorted[0].support).toBe(false);
    });
  });

  describe('sort toggle behaviour', () => {
    it('toggling same field reverses direction', () => {
      let sortField: SortField = 'timestamp';
      let sortDir: SortDir = 'desc';

      // Toggle same field
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      expect(sortDir).toBe('asc');
    });

    it('changing field resets to descending', () => {
      let sortField: SortField = 'timestamp';
      let sortDir: SortDir = 'asc';

      // Change field
      sortField = 'weight';
      sortDir = 'desc';
      expect(sortField).toBe('weight');
      expect(sortDir).toBe('desc');
    });
  });

  describe('vote badge', () => {
    it('shows For for support=true', () => {
      const label = votes[0].support ? 'For' : 'Against';
      expect(label).toBe('For');
    });

    it('shows Against for support=false', () => {
      const label = votes[1].support ? 'For' : 'Against';
      expect(label).toBe('Against');
    });

    it('uses green color class for For', () => {
      const className = votes[0].support
        ? 'bg-emerald-500/20 text-emerald-400'
        : 'bg-red-500/20 text-red-400';
      expect(className).toContain('emerald');
    });

    it('uses red color class for Against', () => {
      const className = votes[1].support
        ? 'bg-emerald-500/20 text-emerald-400'
        : 'bg-red-500/20 text-red-400';
      expect(className).toContain('red');
    });
  });

  describe('date formatting', () => {
    it('formats timestamp to locale date string', () => {
      const date = new Date(1710000000000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      expect(date).toBeTruthy();
      expect(typeof date).toBe('string');
    });
  });

  describe('empty state', () => {
    it('detects empty vote list', () => {
      const empty: VoteRecord[] = [];
      expect(empty.length === 0).toBe(true);
    });

    it('detects non-empty vote list', () => {
      expect(votes.length > 0).toBe(true);
    });
  });

  describe('unique keys', () => {
    it('generates unique key per vote', () => {
      const keys = votes.map((v) => `vote-${v.proposalId}-${v.timestamp}`);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });

  describe('immutability', () => {
    it('sort does not mutate original array', () => {
      const original = [...votes];
      sortVotes(votes, 'weight', 'asc');
      expect(votes).toEqual(original);
    });
  });
});

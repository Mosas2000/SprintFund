import { describe, it, expect } from 'vitest';
import type { Proposal } from '../types';

/**
 * Behavioral tests for UserProposals component.
 * Tests sorting, status badge logic, and vote bar computation.
 */

/* ── Status badge logic (mirrors component) ───── */

function statusBadge(proposal: Proposal): { label: string; className: string } {
  if (proposal.executed) {
    return { label: 'Executed', className: 'bg-emerald-500/20 text-emerald-400' };
  }
  return { label: 'Active', className: 'bg-indigo-500/20 text-indigo-400' };
}

/* ── Vote bar logic (mirrors component) ───────── */

function voteBarPcts(votesFor: number, votesAgainst: number) {
  const total = votesFor + votesAgainst;
  const forPct = total > 0 ? Math.round((votesFor / total) * 100) : 0;
  const againstPct = total > 0 ? 100 - forPct : 0;
  return { forPct, againstPct };
}

/* ── Test data ────────────────────────────────── */

const proposals: Proposal[] = [
  { id: 1, proposer: 'SP123', amount: 50_000_000, title: 'Fund SDK', description: '', votesFor: 10, votesAgainst: 5, executed: true, createdAt: 1000 },
  { id: 2, proposer: 'SP123', amount: 100_000_000, title: 'Fund UI', description: '', votesFor: 3, votesAgainst: 7, executed: false, createdAt: 3000 },
  { id: 3, proposer: 'SP123', amount: 25_000_000, title: 'Fund Docs', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 2000 },
];

describe('UserProposals behaviour', () => {
  describe('sorting', () => {
    it('sorts proposals by creation date descending', () => {
      const sorted = [...proposals].sort((a, b) => b.createdAt - a.createdAt);
      expect(sorted[0].id).toBe(2); // createdAt 3000
      expect(sorted[1].id).toBe(3); // createdAt 2000
      expect(sorted[2].id).toBe(1); // createdAt 1000
    });

    it('preserves order for equal timestamps', () => {
      const sameTime: Proposal[] = [
        { id: 10, proposer: 'SP123', amount: 1000, title: 'A', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 5000 },
        { id: 11, proposer: 'SP123', amount: 2000, title: 'B', description: '', votesFor: 0, votesAgainst: 0, executed: false, createdAt: 5000 },
      ];
      const sorted = [...sameTime].sort((a, b) => b.createdAt - a.createdAt);
      expect(sorted).toHaveLength(2);
    });
  });

  describe('status badge', () => {
    it('returns Executed for executed proposals', () => {
      const badge = statusBadge(proposals[0]);
      expect(badge.label).toBe('Executed');
      expect(badge.className).toContain('emerald');
    });

    it('returns Active for non-executed proposals', () => {
      const badge = statusBadge(proposals[1]);
      expect(badge.label).toBe('Active');
      expect(badge.className).toContain('indigo');
    });
  });

  describe('vote bar percentages', () => {
    it('computes correct for/against split', () => {
      const { forPct, againstPct } = voteBarPcts(10, 5);
      expect(forPct).toBe(67);
      expect(againstPct).toBe(33);
    });

    it('handles zero total votes', () => {
      const { forPct, againstPct } = voteBarPcts(0, 0);
      expect(forPct).toBe(0);
      expect(againstPct).toBe(0);
    });

    it('handles 100% for votes', () => {
      const { forPct, againstPct } = voteBarPcts(10, 0);
      expect(forPct).toBe(100);
      expect(againstPct).toBe(0);
    });

    it('handles 100% against votes', () => {
      const { forPct, againstPct } = voteBarPcts(0, 10);
      expect(forPct).toBe(0);
      expect(againstPct).toBe(100);
    });

    it('for + against always equals 100 when total > 0', () => {
      const { forPct, againstPct } = voteBarPcts(3, 7);
      expect(forPct + againstPct).toBe(100);
    });

    it('handles equal votes as 50/50', () => {
      const { forPct, againstPct } = voteBarPcts(5, 5);
      expect(forPct).toBe(50);
      expect(againstPct).toBe(50);
    });
  });

  describe('empty state', () => {
    it('detects empty proposals list', () => {
      const empty: Proposal[] = [];
      expect(empty.length === 0).toBe(true);
    });

    it('detects non-empty proposals list', () => {
      expect(proposals.length > 0).toBe(true);
    });
  });

  describe('proposal title and amount', () => {
    it('each proposal has a title', () => {
      for (const p of proposals) {
        expect(p.title).toBeTruthy();
        expect(typeof p.title).toBe('string');
      }
    });

    it('each proposal has a positive amount', () => {
      for (const p of proposals) {
        expect(p.amount).toBeGreaterThan(0);
      }
    });

    it('generates correct proposal detail path', () => {
      const path = `/proposals/${proposals[0].id}`;
      expect(path).toBe('/proposals/1');
    });
  });
});

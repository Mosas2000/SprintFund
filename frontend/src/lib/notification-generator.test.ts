import { describe, it, expect } from 'vitest';
import {
  compareSnapshots,
  createEmptySnapshot,
  buildSnapshot,
} from './notification-generator';
import type { ProposalSnapshot } from '../types/notification';

describe('createEmptySnapshot', () => {
  it('returns snapshot with empty collections', () => {
    const snap = createEmptySnapshot();
    expect(snap.knownIds.size).toBe(0);
    expect(snap.executedIds.size).toBe(0);
    expect(snap.voteTotals.size).toBe(0);
  });

  it('returns distinct instances each call', () => {
    const a = createEmptySnapshot();
    const b = createEmptySnapshot();
    expect(a.knownIds).not.toBe(b.knownIds);
    expect(a.executedIds).not.toBe(b.executedIds);
    expect(a.voteTotals).not.toBe(b.voteTotals);
  });
});

describe('buildSnapshot', () => {
  it('populates knownIds from proposal ids', () => {
    const snap = buildSnapshot([
      { id: 1, executed: false, voteCount: 0 },
      { id: 2, executed: false, voteCount: 5 },
    ]);
    expect(snap.knownIds.has(1)).toBe(true);
    expect(snap.knownIds.has(2)).toBe(true);
    expect(snap.knownIds.size).toBe(2);
  });

  it('populates executedIds for executed proposals only', () => {
    const snap = buildSnapshot([
      { id: 1, executed: true, voteCount: 10 },
      { id: 2, executed: false, voteCount: 5 },
    ]);
    expect(snap.executedIds.has(1)).toBe(true);
    expect(snap.executedIds.has(2)).toBe(false);
  });

  it('populates voteTotals correctly', () => {
    const snap = buildSnapshot([
      { id: 1, executed: false, voteCount: 42 },
      { id: 2, executed: false, voteCount: 7 },
    ]);
    expect(snap.voteTotals.get(1)).toBe(42);
    expect(snap.voteTotals.get(2)).toBe(7);
  });

  it('handles empty array', () => {
    const snap = buildSnapshot([]);
    expect(snap.knownIds.size).toBe(0);
    expect(snap.executedIds.size).toBe(0);
    expect(snap.voteTotals.size).toBe(0);
  });
});

describe('compareSnapshots - new proposals', () => {
  it('detects a single new proposal', () => {
    const prev = createEmptySnapshot();
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 0]]),
    };
    const notifications = compareSnapshots(prev, curr);
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('proposal_created');
    expect(notifications[0].proposalId).toBe(1);
    expect(notifications[0].read).toBe(false);
  });

  it('detects multiple new proposals', () => {
    const prev: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 5]]),
    };
    const curr: ProposalSnapshot = {
      knownIds: new Set([1, 2, 3]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 5], [2, 0], [3, 0]]),
    };
    const notifications = compareSnapshots(prev, curr);
    const created = notifications.filter((n) => n.type === 'proposal_created');
    expect(created).toHaveLength(2);
    const ids = created.map((n) => n.proposalId).sort();
    expect(ids).toEqual([2, 3]);
  });

  it('produces no notification for existing proposals', () => {
    const snap: ProposalSnapshot = {
      knownIds: new Set([1, 2]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 0], [2, 0]]),
    };
    const notifications = compareSnapshots(snap, snap);
    const created = notifications.filter((n) => n.type === 'proposal_created');
    expect(created).toHaveLength(0);
  });
});

describe('compareSnapshots - executed proposals', () => {
  it('detects a newly executed proposal', () => {
    const prev: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 10]]),
    };
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set([1]),
      voteTotals: new Map([[1, 10]]),
    };
    const notifications = compareSnapshots(prev, curr);
    const executed = notifications.filter((n) => n.type === 'proposal_executed');
    expect(executed).toHaveLength(1);
    expect(executed[0].proposalId).toBe(1);
  });

  it('ignores already executed proposals', () => {
    const snap: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set([1]),
      voteTotals: new Map([[1, 10]]),
    };
    const notifications = compareSnapshots(snap, snap);
    const executed = notifications.filter((n) => n.type === 'proposal_executed');
    expect(executed).toHaveLength(0);
  });
});

describe('compareSnapshots - vote milestones', () => {
  it('detects crossing a single milestone threshold', () => {
    const prev: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 3]]),
    };
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 7]]),
    };
    const notifications = compareSnapshots(prev, curr);
    const milestones = notifications.filter((n) => n.type === 'vote_milestone');
    expect(milestones).toHaveLength(1);
    expect(milestones[0].title).toContain('5 votes');
  });

  it('detects crossing multiple milestones at once', () => {
    const prev: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 2]]),
    };
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 30]]),
    };
    const notifications = compareSnapshots(prev, curr);
    const milestones = notifications.filter((n) => n.type === 'vote_milestone');
    // Should cross 5, 10, 25 thresholds
    expect(milestones).toHaveLength(3);
    const titles = milestones.map((n) => n.title);
    expect(titles.some((t) => t.includes('5 votes'))).toBe(true);
    expect(titles.some((t) => t.includes('10 votes'))).toBe(true);
    expect(titles.some((t) => t.includes('25 votes'))).toBe(true);
  });

  it('produces no milestone when votes unchanged', () => {
    const snap: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 7]]),
    };
    const notifications = compareSnapshots(snap, snap);
    const milestones = notifications.filter((n) => n.type === 'vote_milestone');
    expect(milestones).toHaveLength(0);
  });

  it('supports custom milestone thresholds', () => {
    const prev: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 0]]),
    };
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 20]]),
    };
    const customMilestones = { thresholds: [15] };
    const notifications = compareSnapshots(prev, curr, customMilestones);
    const milestones = notifications.filter((n) => n.type === 'vote_milestone');
    expect(milestones).toHaveLength(1);
    expect(milestones[0].title).toContain('15 votes');
  });

  it('handles new proposal with votes above thresholds', () => {
    const prev = createEmptySnapshot();
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 50]]),
    };
    const notifications = compareSnapshots(prev, curr);
    // Should have proposal_created + milestone notifications
    const created = notifications.filter((n) => n.type === 'proposal_created');
    const milestones = notifications.filter((n) => n.type === 'vote_milestone');
    expect(created).toHaveLength(1);
    // Votes go from 0 (absent) to 50, crossing 5, 10, 25, 50
    expect(milestones).toHaveLength(4);
  });
});

describe('compareSnapshots - mixed scenarios', () => {
  it('detects multiple event types in one comparison', () => {
    const prev: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 3]]),
    };
    const curr: ProposalSnapshot = {
      knownIds: new Set([1, 2]),
      executedIds: new Set([1]),
      voteTotals: new Map([[1, 12], [2, 0]]),
    };
    const notifications = compareSnapshots(prev, curr);
    const types = new Set(notifications.map((n) => n.type));
    expect(types.has('proposal_created')).toBe(true);
    expect(types.has('proposal_executed')).toBe(true);
    expect(types.has('vote_milestone')).toBe(true);
  });

  it('all notifications have unique ids', () => {
    const prev = createEmptySnapshot();
    const curr: ProposalSnapshot = {
      knownIds: new Set([1, 2, 3]),
      executedIds: new Set([1]),
      voteTotals: new Map([[1, 100], [2, 50], [3, 0]]),
    };
    const notifications = compareSnapshots(prev, curr);
    const ids = notifications.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all notifications have createdAt timestamp', () => {
    const prev = createEmptySnapshot();
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 0]]),
    };
    const before = Date.now();
    const notifications = compareSnapshots(prev, curr);
    const after = Date.now();
    for (const n of notifications) {
      expect(n.createdAt).toBeGreaterThanOrEqual(before);
      expect(n.createdAt).toBeLessThanOrEqual(after);
    }
  });
});

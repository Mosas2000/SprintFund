import { describe, it, expect } from 'vitest';
import type { Notification } from '../types/notification';
import type { NotificationPreferences } from '../lib/notification-preferences';
import {
  filterByType,
  filterUnread,
  filterRead,
  filterByPreferences,
  filterByTimeRange,
  filterByProposal,
  sortByNewest,
  sortByOldest,
  groupByType,
  countByType,
  searchByTitle,
} from './notification-filters';

function makeNotification(overrides: Partial<Notification> = {}): Notification {
  return {
    id: `n-${Math.random()}`,
    type: 'proposal_created',
    title: 'Test Notification',
    createdAt: Date.now(),
    read: false,
    ...overrides,
  };
}

describe('filterByType', () => {
  it('returns only notifications of the specified type', () => {
    const list = [
      makeNotification({ type: 'proposal_created' }),
      makeNotification({ type: 'vote_milestone' }),
      makeNotification({ type: 'proposal_created' }),
    ];
    const result = filterByType(list, 'proposal_created');
    expect(result).toHaveLength(2);
    expect(result.every((n) => n.type === 'proposal_created')).toBe(true);
  });

  it('returns empty array when no matches', () => {
    const list = [makeNotification({ type: 'proposal_created' })];
    expect(filterByType(list, 'stake_change')).toHaveLength(0);
  });
});

describe('filterUnread', () => {
  it('returns only unread notifications', () => {
    const list = [
      makeNotification({ read: false }),
      makeNotification({ read: true }),
      makeNotification({ read: false }),
    ];
    const result = filterUnread(list);
    expect(result).toHaveLength(2);
    expect(result.every((n) => !n.read)).toBe(true);
  });
});

describe('filterRead', () => {
  it('returns only read notifications', () => {
    const list = [
      makeNotification({ read: false }),
      makeNotification({ read: true }),
    ];
    const result = filterRead(list);
    expect(result).toHaveLength(1);
    expect(result[0].read).toBe(true);
  });
});

describe('filterByPreferences', () => {
  it('filters out disabled notification types', () => {
    const prefs: NotificationPreferences = {
      proposal_created: true,
      proposal_executed: false,
      vote_milestone: true,
      stake_change: false,
      vote_received: true,
    };
    const list = [
      makeNotification({ type: 'proposal_created' }),
      makeNotification({ type: 'proposal_executed' }),
      makeNotification({ type: 'stake_change' }),
      makeNotification({ type: 'vote_milestone' }),
    ];
    const result = filterByPreferences(list, prefs);
    expect(result).toHaveLength(2);
    expect(result.map((n) => n.type)).toContain('proposal_created');
    expect(result.map((n) => n.type)).toContain('vote_milestone');
  });

  it('returns all when all types are enabled', () => {
    const prefs: NotificationPreferences = {
      proposal_created: true,
      proposal_executed: true,
      vote_milestone: true,
      stake_change: true,
      vote_received: true,
    };
    const list = [makeNotification(), makeNotification()];
    expect(filterByPreferences(list, prefs)).toHaveLength(2);
  });
});

describe('filterByTimeRange', () => {
  it('filters notifications after a timestamp', () => {
    const list = [
      makeNotification({ createdAt: 1000 }),
      makeNotification({ createdAt: 2000 }),
      makeNotification({ createdAt: 3000 }),
    ];
    const result = filterByTimeRange(list, { after: 1500 });
    expect(result).toHaveLength(2);
  });

  it('filters notifications before a timestamp', () => {
    const list = [
      makeNotification({ createdAt: 1000 }),
      makeNotification({ createdAt: 2000 }),
      makeNotification({ createdAt: 3000 }),
    ];
    const result = filterByTimeRange(list, { before: 2500 });
    expect(result).toHaveLength(2);
  });

  it('filters within a range', () => {
    const list = [
      makeNotification({ createdAt: 1000 }),
      makeNotification({ createdAt: 2000 }),
      makeNotification({ createdAt: 3000 }),
    ];
    const result = filterByTimeRange(list, { after: 1500, before: 2500 });
    expect(result).toHaveLength(1);
    expect(result[0].createdAt).toBe(2000);
  });
});

describe('filterByProposal', () => {
  it('returns notifications for a specific proposal', () => {
    const list = [
      makeNotification({ proposalId: 1 }),
      makeNotification({ proposalId: 2 }),
      makeNotification({ proposalId: 1 }),
    ];
    const result = filterByProposal(list, 1);
    expect(result).toHaveLength(2);
  });

  it('returns empty when no matching proposalId', () => {
    const list = [makeNotification({ proposalId: 1 })];
    expect(filterByProposal(list, 99)).toHaveLength(0);
  });
});

describe('sortByNewest', () => {
  it('sorts newest first', () => {
    const list = [
      makeNotification({ createdAt: 1000 }),
      makeNotification({ createdAt: 3000 }),
      makeNotification({ createdAt: 2000 }),
    ];
    const result = sortByNewest(list);
    expect(result[0].createdAt).toBe(3000);
    expect(result[1].createdAt).toBe(2000);
    expect(result[2].createdAt).toBe(1000);
  });

  it('does not mutate the original array', () => {
    const list = [
      makeNotification({ createdAt: 2000 }),
      makeNotification({ createdAt: 1000 }),
    ];
    const original = [...list];
    sortByNewest(list);
    expect(list[0].createdAt).toBe(original[0].createdAt);
  });
});

describe('sortByOldest', () => {
  it('sorts oldest first', () => {
    const list = [
      makeNotification({ createdAt: 3000 }),
      makeNotification({ createdAt: 1000 }),
      makeNotification({ createdAt: 2000 }),
    ];
    const result = sortByOldest(list);
    expect(result[0].createdAt).toBe(1000);
    expect(result[1].createdAt).toBe(2000);
    expect(result[2].createdAt).toBe(3000);
  });
});

describe('groupByType', () => {
  it('groups notifications into type buckets', () => {
    const list = [
      makeNotification({ type: 'proposal_created' }),
      makeNotification({ type: 'vote_milestone' }),
      makeNotification({ type: 'proposal_created' }),
    ];
    const groups = groupByType(list);
    expect(groups.proposal_created).toHaveLength(2);
    expect(groups.vote_milestone).toHaveLength(1);
    expect(groups.proposal_executed).toHaveLength(0);
    expect(groups.stake_change).toHaveLength(0);
    expect(groups.vote_received).toHaveLength(0);
  });
});

describe('countByType', () => {
  it('returns counts per type', () => {
    const list = [
      makeNotification({ type: 'proposal_created' }),
      makeNotification({ type: 'proposal_created' }),
      makeNotification({ type: 'vote_received' }),
    ];
    const counts = countByType(list);
    expect(counts.proposal_created).toBe(2);
    expect(counts.vote_received).toBe(1);
    expect(counts.proposal_executed).toBe(0);
  });

  it('returns all zeros for empty list', () => {
    const counts = countByType([]);
    expect(Object.values(counts).every((c) => c === 0)).toBe(true);
  });
});

describe('searchByTitle', () => {
  it('finds notifications matching title substring', () => {
    const list = [
      makeNotification({ title: 'New proposal #5 created' }),
      makeNotification({ title: 'Proposal #3 executed' }),
      makeNotification({ title: 'Vote milestone reached' }),
    ];
    const result = searchByTitle(list, 'proposal');
    expect(result).toHaveLength(2);
  });

  it('is case-insensitive', () => {
    const list = [makeNotification({ title: 'New PROPOSAL created' })];
    expect(searchByTitle(list, 'proposal')).toHaveLength(1);
    expect(searchByTitle(list, 'PROPOSAL')).toHaveLength(1);
  });

  it('returns empty array when no matches', () => {
    const list = [makeNotification({ title: 'Test' })];
    expect(searchByTitle(list, 'xyz')).toHaveLength(0);
  });
});

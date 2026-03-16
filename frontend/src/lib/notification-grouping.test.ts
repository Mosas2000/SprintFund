import { describe, it, expect } from 'vitest';
import { groupByType, groupByProposal } from './notification-grouping';
import type { Notification } from '../types/notification';

function makeNotification(overrides: Partial<Notification> = {}): Notification {
  return {
    id: `notif-${Math.random()}`,
    type: 'proposal_created',
    title: 'Test',
    createdAt: Date.now(),
    read: false,
    ...overrides,
  };
}

describe('groupByType', () => {
  it('returns empty array for no notifications', () => {
    expect(groupByType([])).toEqual([]);
  });

  it('groups notifications by type', () => {
    const notifications = [
      makeNotification({ type: 'proposal_created', createdAt: 3000 }),
      makeNotification({ type: 'proposal_created', createdAt: 1000 }),
      makeNotification({ type: 'vote_milestone', createdAt: 2000 }),
    ];
    const groups = groupByType(notifications);
    expect(groups).toHaveLength(2);
  });

  it('sorts groups by latest timestamp descending', () => {
    const notifications = [
      makeNotification({ type: 'vote_milestone', createdAt: 1000 }),
      makeNotification({ type: 'proposal_created', createdAt: 5000 }),
    ];
    const groups = groupByType(notifications);
    expect(groups[0].type).toBe('proposal_created');
    expect(groups[1].type).toBe('vote_milestone');
  });

  it('tracks unread count per group', () => {
    const notifications = [
      makeNotification({ type: 'proposal_created', read: false }),
      makeNotification({ type: 'proposal_created', read: true }),
      makeNotification({ type: 'proposal_created', read: false }),
    ];
    const groups = groupByType(notifications);
    expect(groups[0].unreadCount).toBe(2);
  });

  it('latestTimestamp is the max createdAt in the group', () => {
    const notifications = [
      makeNotification({ type: 'vote_received', createdAt: 100 }),
      makeNotification({ type: 'vote_received', createdAt: 500 }),
      makeNotification({ type: 'vote_received', createdAt: 300 }),
    ];
    const groups = groupByType(notifications);
    expect(groups[0].latestTimestamp).toBe(500);
  });
});

describe('groupByProposal', () => {
  it('returns empty map for no notifications', () => {
    expect(groupByProposal([]).size).toBe(0);
  });

  it('groups by proposalId', () => {
    const notifications = [
      makeNotification({ proposalId: 1 }),
      makeNotification({ proposalId: 1 }),
      makeNotification({ proposalId: 2 }),
    ];
    const map = groupByProposal(notifications);
    expect(map.size).toBe(2);
    expect(map.get(1)!.length).toBe(2);
    expect(map.get(2)!.length).toBe(1);
  });

  it('skips notifications without proposalId', () => {
    const notifications = [
      makeNotification({ proposalId: 1 }),
      makeNotification({ proposalId: undefined }),
    ];
    const map = groupByProposal(notifications);
    expect(map.size).toBe(1);
  });
});

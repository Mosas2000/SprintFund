import { describe, it, expect } from 'vitest';
import { filterNotifications } from './notification-filter';
import type { Notification } from '../types/notification';

function makeNotification(overrides: Partial<Notification> = {}): Notification {
  return {
    id: `notif-${Math.random()}`,
    type: 'proposal_created',
    title: 'Test',
    createdAt: 5000,
    read: false,
    ...overrides,
  };
}

describe('filterNotifications', () => {
  it('returns all notifications with empty filter', () => {
    const list = [makeNotification(), makeNotification()];
    expect(filterNotifications(list, {})).toHaveLength(2);
  });

  it('filters by notification type', () => {
    const list = [
      makeNotification({ type: 'proposal_created' }),
      makeNotification({ type: 'vote_milestone' }),
      makeNotification({ type: 'proposal_executed' }),
    ];
    const result = filterNotifications(list, { types: ['proposal_created'] });
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('proposal_created');
  });

  it('filters by multiple types', () => {
    const list = [
      makeNotification({ type: 'proposal_created' }),
      makeNotification({ type: 'vote_milestone' }),
      makeNotification({ type: 'proposal_executed' }),
    ];
    const result = filterNotifications(list, { types: ['proposal_created', 'vote_milestone'] });
    expect(result).toHaveLength(2);
  });

  it('filters by read state: unread', () => {
    const list = [
      makeNotification({ read: false }),
      makeNotification({ read: true }),
      makeNotification({ read: false }),
    ];
    const result = filterNotifications(list, { readState: 'unread' });
    expect(result).toHaveLength(2);
  });

  it('filters by read state: read', () => {
    const list = [
      makeNotification({ read: false }),
      makeNotification({ read: true }),
    ];
    const result = filterNotifications(list, { readState: 'read' });
    expect(result).toHaveLength(1);
  });

  it('filters by fromTimestamp', () => {
    const list = [
      makeNotification({ createdAt: 1000 }),
      makeNotification({ createdAt: 5000 }),
      makeNotification({ createdAt: 10000 }),
    ];
    const result = filterNotifications(list, { fromTimestamp: 5000 });
    expect(result).toHaveLength(2);
  });

  it('filters by toTimestamp', () => {
    const list = [
      makeNotification({ createdAt: 1000 }),
      makeNotification({ createdAt: 5000 }),
      makeNotification({ createdAt: 10000 }),
    ];
    const result = filterNotifications(list, { toTimestamp: 5000 });
    expect(result).toHaveLength(2);
  });

  it('filters by proposalId', () => {
    const list = [
      makeNotification({ proposalId: 1 }),
      makeNotification({ proposalId: 2 }),
      makeNotification({ proposalId: 1 }),
    ];
    const result = filterNotifications(list, { proposalId: 1 });
    expect(result).toHaveLength(2);
  });

  it('combines multiple filters', () => {
    const list = [
      makeNotification({ type: 'proposal_created', read: false, createdAt: 1000 }),
      makeNotification({ type: 'proposal_created', read: true, createdAt: 5000 }),
      makeNotification({ type: 'vote_milestone', read: false, createdAt: 8000 }),
    ];
    const result = filterNotifications(list, {
      types: ['proposal_created'],
      readState: 'unread',
    });
    expect(result).toHaveLength(1);
    expect(result[0].createdAt).toBe(1000);
  });

  it('readState all returns everything', () => {
    const list = [
      makeNotification({ read: false }),
      makeNotification({ read: true }),
    ];
    const result = filterNotifications(list, { readState: 'all' });
    expect(result).toHaveLength(2);
  });
});

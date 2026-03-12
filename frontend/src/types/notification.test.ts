import { describe, it, expect } from 'vitest';
import {
  DEFAULT_MILESTONES,
} from './notification';
import type {
  NotificationType,
  Notification,
  NotificationsState,
  ProposalSnapshot,
  MilestoneConfig,
  NotificationBellProps,
  NotificationDropdownProps,
  NotificationItemProps,
} from './notification';

describe('NotificationType', () => {
  it('accepts all five notification categories', () => {
    const types: NotificationType[] = [
      'proposal_created',
      'proposal_executed',
      'vote_milestone',
      'stake_change',
      'vote_received',
    ];
    expect(types).toHaveLength(5);
    types.forEach((t) => expect(typeof t).toBe('string'));
  });
});

describe('Notification', () => {
  it('constructs a complete notification object', () => {
    const n: Notification = {
      id: 'notif-1',
      type: 'proposal_created',
      title: 'New Proposal',
      description: 'A new proposal has been submitted',
      createdAt: Date.now(),
      read: false,
      proposalId: 42,
      txId: '0xabc',
    };
    expect(n.id).toBe('notif-1');
    expect(n.type).toBe('proposal_created');
    expect(n.read).toBe(false);
    expect(n.proposalId).toBe(42);
    expect(n.txId).toBe('0xabc');
  });

  it('allows optional fields to be omitted', () => {
    const n: Notification = {
      id: 'notif-2',
      type: 'stake_change',
      title: 'Stake Updated',
      createdAt: 1000,
      read: true,
    };
    expect(n.description).toBeUndefined();
    expect(n.proposalId).toBeUndefined();
    expect(n.txId).toBeUndefined();
  });

  it('read field toggles between true and false', () => {
    const n: Notification = {
      id: 'n1', type: 'vote_received', title: 'Vote', createdAt: 0, read: false,
    };
    expect(n.read).toBe(false);
    const updated = { ...n, read: true };
    expect(updated.read).toBe(true);
  });
});

describe('ProposalSnapshot', () => {
  it('tracks known, executed, and vote totals', () => {
    const snapshot: ProposalSnapshot = {
      knownIds: new Set([1, 2, 3]),
      executedIds: new Set([1]),
      voteTotals: new Map([[1, 15], [2, 3], [3, 0]]),
    };
    expect(snapshot.knownIds.size).toBe(3);
    expect(snapshot.executedIds.has(1)).toBe(true);
    expect(snapshot.executedIds.has(2)).toBe(false);
    expect(snapshot.voteTotals.get(1)).toBe(15);
  });

  it('starts empty for a fresh session', () => {
    const snapshot: ProposalSnapshot = {
      knownIds: new Set(),
      executedIds: new Set(),
      voteTotals: new Map(),
    };
    expect(snapshot.knownIds.size).toBe(0);
    expect(snapshot.executedIds.size).toBe(0);
    expect(snapshot.voteTotals.size).toBe(0);
  });
});

describe('MilestoneConfig', () => {
  it('DEFAULT_MILESTONES has five thresholds', () => {
    expect(DEFAULT_MILESTONES.thresholds).toEqual([5, 10, 25, 50, 100]);
  });

  it('thresholds are sorted ascending', () => {
    const sorted = [...DEFAULT_MILESTONES.thresholds].sort((a, b) => a - b);
    expect(DEFAULT_MILESTONES.thresholds).toEqual(sorted);
  });

  it('allows custom milestone configs', () => {
    const custom: MilestoneConfig = { thresholds: [3, 7, 20] };
    expect(custom.thresholds).toHaveLength(3);
  });
});

describe('NotificationsState interface', () => {
  it('defines the expected state shape', () => {
    const state: NotificationsState = {
      notifications: [],
      addNotifications: () => {},
      markAsRead: () => {},
      markAllAsRead: () => {},
      removeNotification: () => {},
      clearAll: () => {},
    };
    expect(state.notifications).toEqual([]);
    expect(typeof state.addNotifications).toBe('function');
    expect(typeof state.markAsRead).toBe('function');
    expect(typeof state.markAllAsRead).toBe('function');
    expect(typeof state.removeNotification).toBe('function');
    expect(typeof state.clearAll).toBe('function');
  });
});

describe('Component prop interfaces', () => {
  it('NotificationBellProps has required fields', () => {
    const props: NotificationBellProps = {
      unreadCount: 3,
      isOpen: false,
      onToggle: () => {},
    };
    expect(props.unreadCount).toBe(3);
    expect(props.isOpen).toBe(false);
    expect(typeof props.onToggle).toBe('function');
  });

  it('NotificationDropdownProps has all required callbacks', () => {
    const props: NotificationDropdownProps = {
      notifications: [],
      onNotificationClick: () => {},
      onMarkAllRead: () => {},
      onClearAll: () => {},
      onClose: () => {},
    };
    expect(props.notifications).toEqual([]);
    expect(typeof props.onNotificationClick).toBe('function');
    expect(typeof props.onMarkAllRead).toBe('function');
    expect(typeof props.onClearAll).toBe('function');
    expect(typeof props.onClose).toBe('function');
  });

  it('NotificationItemProps has notification and onClick', () => {
    const notification: Notification = {
      id: 'test', type: 'proposal_created', title: 'Test',
      createdAt: 0, read: false,
    };
    const props: NotificationItemProps = {
      notification,
      onClick: () => {},
    };
    expect(props.notification.id).toBe('test');
    expect(typeof props.onClick).toBe('function');
  });
});

import { describe, it, expect } from 'vitest';
import * as selectors from './notification-selectors';

describe('notification-selectors module exports', () => {
  it('exports useNotifications', () => {
    expect(typeof selectors.useNotifications).toBe('function');
  });

  it('exports useUnreadCount', () => {
    expect(typeof selectors.useUnreadCount).toBe('function');
  });

  it('exports useHasUnread', () => {
    expect(typeof selectors.useHasUnread).toBe('function');
  });

  it('exports useNotificationsByType', () => {
    expect(typeof selectors.useNotificationsByType).toBe('function');
  });

  it('exports useAddNotifications', () => {
    expect(typeof selectors.useAddNotifications).toBe('function');
  });

  it('exports useMarkAsRead', () => {
    expect(typeof selectors.useMarkAsRead).toBe('function');
  });

  it('exports useMarkAllAsRead', () => {
    expect(typeof selectors.useMarkAllAsRead).toBe('function');
  });

  it('exports useRemoveNotification', () => {
    expect(typeof selectors.useRemoveNotification).toBe('function');
  });

  it('exports useClearAllNotifications', () => {
    expect(typeof selectors.useClearAllNotifications).toBe('function');
  });

  it('exports exactly nine selectors', () => {
    const names = Object.keys(selectors);
    expect(names).toHaveLength(9);
    expect(names).toEqual(
      expect.arrayContaining([
        'useNotifications',
        'useUnreadCount',
        'useHasUnread',
        'useNotificationsByType',
        'useAddNotifications',
        'useMarkAsRead',
        'useMarkAllAsRead',
        'useRemoveNotification',
        'useClearAllNotifications',
      ]),
    );
  });
});

describe('selector isolation', () => {
  it('each selector is a distinct function reference', () => {
    const fns = [
      selectors.useNotifications,
      selectors.useUnreadCount,
      selectors.useHasUnread,
      selectors.useNotificationsByType,
      selectors.useAddNotifications,
      selectors.useMarkAsRead,
      selectors.useMarkAllAsRead,
      selectors.useRemoveNotification,
      selectors.useClearAllNotifications,
    ];
    const unique = new Set(fns);
    expect(unique.size).toBe(fns.length);
  });

  it('does not re-export the raw store', () => {
    const names = Object.keys(selectors);
    expect(names).not.toContain('useNotificationsStore');
  });
});

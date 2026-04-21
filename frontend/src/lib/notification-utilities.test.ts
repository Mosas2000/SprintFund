import { describe, it, expect } from 'vitest';
import {
  notificationBatch,
  getNotificationPriority,
  sortNotificationsByPriority,
  filterUnreadNotifications,
  getNotificationStats,
} from './notification-utilities';
import { Notification } from '../types/notifications';

describe('Notification Utilities', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'proposalCreated',
      title: 'Test',
      message: 'Test message',
      timestamp: Date.now(),
      read: false,
    },
    {
      id: '2',
      type: 'proposalExecuted',
      title: 'Test',
      message: 'Test message',
      timestamp: Date.now(),
      read: true,
    },
    {
      id: '3',
      type: 'proposalVoting',
      title: 'Test',
      message: 'Test message',
      timestamp: Date.now(),
      read: false,
    },
  ];

  describe('notificationBatch', () => {
    it('groups notifications by type', () => {
      const batches = notificationBatch(mockNotifications);

      expect(batches.size).toBe(3);
      expect(batches.get('proposalCreated')).toHaveLength(1);
      expect(batches.get('proposalExecuted')).toHaveLength(1);
      expect(batches.get('proposalVoting')).toHaveLength(1);
    });

    it('handles empty notifications', () => {
      const batches = notificationBatch([]);

      expect(batches.size).toBe(0);
    });
  });

  describe('getNotificationPriority', () => {
    it('returns correct priority for known types', () => {
      expect(getNotificationPriority('proposalExecuted')).toBe(1);
      expect(getNotificationPriority('proposalVoting')).toBe(3);
      expect(getNotificationPriority('delegationReceived')).toBe(5);
    });

    it('returns high priority for unknown types', () => {
      expect(getNotificationPriority('unknownType')).toBe(999);
    });
  });

  describe('sortNotificationsByPriority', () => {
    it('sorts notifications by priority', () => {
      const sorted = sortNotificationsByPriority(mockNotifications);

      expect(sorted[0].type).toBe('proposalExecuted');
      expect(sorted[1].type).toBe('proposalVoting');
      expect(sorted[2].type).toBe('proposalCreated');
    });
  });

  describe('filterUnreadNotifications', () => {
    it('returns only unread notifications', () => {
      const unread = filterUnreadNotifications(mockNotifications);

      expect(unread).toHaveLength(2);
      expect(unread.every(n => !n.read)).toBe(true);
    });

    it('handles all read notifications', () => {
      const allRead = mockNotifications.map(n => ({ ...n, read: true }));
      const unread = filterUnreadNotifications(allRead);

      expect(unread).toHaveLength(0);
    });
  });

  describe('getNotificationStats', () => {
    it('calculates correct statistics', () => {
      const stats = getNotificationStats(mockNotifications);

      expect(stats.total).toBe(3);
      expect(stats.unread).toBe(2);
      expect(stats.byType.proposalCreated).toBe(1);
      expect(stats.byType.proposalExecuted).toBe(1);
      expect(stats.byType.proposalVoting).toBe(1);
    });

    it('handles empty notifications', () => {
      const stats = getNotificationStats([]);

      expect(stats.total).toBe(0);
      expect(stats.unread).toBe(0);
      expect(Object.keys(stats.byType)).toHaveLength(0);
    });
  });
});

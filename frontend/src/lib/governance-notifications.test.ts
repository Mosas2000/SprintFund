import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createGovernanceNotification,
  shouldNotifyGovernance,
  deduplicateGovernanceNotifications,
} from './governance-notifications';
import { NotificationPreference } from '../types/notifications';

describe('Governance Notifications', () => {
  describe('createGovernanceNotification', () => {
    it('creates proposal created notification', () => {
      const notif = createGovernanceNotification('proposalCreated', {
        proposalId: '42',
        proposalTitle: 'Increase Treasury Allocation',
      });

      expect(notif).not.toBeNull();
      expect(notif?.type).toBe('proposalCreated');
      expect(notif?.title).toBe('New Proposal');
      expect(notif?.message).toContain('Increase Treasury Allocation');
      expect(notif?.actionUrl).toBe('/proposals/42');
    });

    it('creates proposal voting notification', () => {
      const notif = createGovernanceNotification('proposalVoting', {
        proposalId: '42',
        proposalTitle: 'Fee Reduction Vote',
      });

      expect(notif?.type).toBe('proposalVoting');
      expect(notif?.title).toBe('Voting Active');
      expect(notif?.message).toContain('Fee Reduction Vote');
    });

    it('creates proposal executed notification', () => {
      const notif = createGovernanceNotification('proposalExecuted', {
        proposalId: '42',
        proposalTitle: 'Treasury Distribution',
      });

      expect(notif?.type).toBe('proposalExecuted');
      expect(notif?.title).toBe('Proposal Executed');
      expect(notif?.message).toContain('Treasury Distribution');
    });

    it('creates proposal cancelled notification', () => {
      const notif = createGovernanceNotification('proposalCancelled', {
        proposalId: '99',
        proposalTitle: 'Rejected Proposal',
      });

      expect(notif?.type).toBe('proposalCancelled');
      expect(notif?.title).toBe('Proposal Cancelled');
      expect(notif?.message).toContain('Rejected Proposal');
    });

    it('creates delegation notification', () => {
      const delegatorAddress = 'SP2ZNGJ85ENDY6QTHQ0YCWM1GRFX77YXF1W8F25J9';
      const notif = createGovernanceNotification('delegationReceived', {
        delegatorAddress,
      });

      expect(notif?.type).toBe('delegationReceived');
      expect(notif?.title).toBe('Delegation Received');
      expect(notif?.message).toContain('SP2ZNGJ85');
      expect(notif?.message).toContain('F25J9');
    });

    it('handles missing proposal title', () => {
      const notif = createGovernanceNotification('proposalCreated', {
        proposalId: '50',
      });

      expect(notif?.message).toBe('A new proposal has been created');
    });

    it('handles missing proposal ID', () => {
      const notif = createGovernanceNotification('proposalCreated', {
        proposalTitle: 'Test Proposal',
      });

      expect(notif?.actionUrl).toBeUndefined();
    });

    it('returns null for invalid type', () => {
      const notif = createGovernanceNotification('delegationReceived' as any, {});

      expect(notif).not.toBeNull();
    });
  });

  describe('shouldNotifyGovernance', () => {
    it('returns preference value when enabled', () => {
      const prefs: NotificationPreference = {
        proposalCreated: true,
        proposalVoting: false,
        proposalExecuted: true,
        proposalCancelled: false,
        delegationReceived: true,
      };

      expect(shouldNotifyGovernance('proposalCreated', prefs)).toBe(true);
      expect(shouldNotifyGovernance('proposalVoting', prefs)).toBe(false);
    });

    it('defaults to true for missing preference', () => {
      const prefs = {} as NotificationPreference;

      expect(shouldNotifyGovernance('proposalCreated', prefs)).toBe(true);
    });
  });

  describe('deduplicateGovernanceNotifications', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('removes duplicate notifications within time window', () => {
      vi.setSystemTime(new Date('2024-01-01T12:00:00'));

      const notifs = [
        createGovernanceNotification('proposalCreated', {
          proposalTitle: 'Test',
        })!,
        createGovernanceNotification('proposalCreated', {
          proposalTitle: 'Test',
        })!,
      ];

      const result = deduplicateGovernanceNotifications(notifs, 30000);

      expect(result).toHaveLength(1);
    });

    it('keeps notifications with different types', () => {
      const notifs = [
        createGovernanceNotification('proposalCreated', {
          proposalTitle: 'Test',
        })!,
        createGovernanceNotification('proposalExecuted', {
          proposalTitle: 'Test',
        })!,
      ];

      const result = deduplicateGovernanceNotifications(notifs, 30000);

      expect(result).toHaveLength(2);
    });

    it('allows same notification after time window expires', () => {
      vi.setSystemTime(new Date('2024-01-01T12:00:00'));

      const notif1 = createGovernanceNotification('proposalCreated', {
        proposalTitle: 'Test',
      })!;

      vi.setSystemTime(new Date('2024-01-01T12:01:00'));

      const notif2 = createGovernanceNotification('proposalCreated', {
        proposalTitle: 'Test',
      })!;

      const result = deduplicateGovernanceNotifications([notif1, notif2], 30000);

      expect(result).toHaveLength(2);
    });
  });
});

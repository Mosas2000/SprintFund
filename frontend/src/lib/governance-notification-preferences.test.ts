import { describe, it, expect, beforeEach } from 'vitest';
import {
  getGovernanceNotificationPreferences,
  saveGovernanceNotificationPreferences,
  updateGovernanceNotificationPreference,
  defaultGovernanceNotificationPreferences,
} from './governance-notification-preferences';
import { NotificationPreference } from '../types/notifications';

describe('Governance Notification Preferences', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default preferences when none are stored', () => {
    const prefs = getGovernanceNotificationPreferences();

    expect(prefs).toEqual(defaultGovernanceNotificationPreferences);
  });

  it('saves and retrieves notification preferences', () => {
    const testPrefs: NotificationPreference = {
      proposalCreated: true,
      proposalVoting: false,
      proposalExecuted: true,
      proposalCancelled: false,
      delegationReceived: true,
    };

    saveGovernanceNotificationPreferences(testPrefs);
    const retrieved = getGovernanceNotificationPreferences();

    expect(retrieved).toEqual(testPrefs);
  });

  it('handles localStorage errors gracefully', () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('Storage full');
    };

    expect(() => {
      saveGovernanceNotificationPreferences({
        ...defaultGovernanceNotificationPreferences,
        proposalCreated: false,
      });
    }).not.toThrow();

    localStorage.setItem = originalSetItem;
  });

  it('updates individual preferences', () => {
    const initial = getGovernanceNotificationPreferences();
    const updated = updateGovernanceNotificationPreference('proposalCreated', false);

    expect(updated.proposalCreated).toBe(false);
    expect(updated.proposalExecuted).toBe(initial.proposalExecuted);
  });

  it('persists updates to localStorage', () => {
    updateGovernanceNotificationPreference('proposalVoting', false);
    const retrieved = getGovernanceNotificationPreferences();

    expect(retrieved.proposalVoting).toBe(false);
  });
});

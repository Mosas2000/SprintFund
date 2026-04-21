import { NotificationPreference } from '../types/notifications';

const STORAGE_KEY = 'governance-notification-prefs';

export const defaultGovernanceNotificationPreferences: NotificationPreference = {
  proposalCreated: true,
  proposalVoting: true,
  proposalExecuted: true,
  proposalCancelled: true,
  delegationReceived: true,
};

export const getGovernanceNotificationPreferences = (): NotificationPreference => {
  if (typeof window === 'undefined') {
    return defaultGovernanceNotificationPreferences;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultGovernanceNotificationPreferences;
    }
    return JSON.parse(stored);
  } catch {
    return defaultGovernanceNotificationPreferences;
  }
};

export const saveGovernanceNotificationPreferences = (
  preferences: NotificationPreference
): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save governance notification preferences:', error);
  }
};

export const updateGovernanceNotificationPreference = (
  key: keyof NotificationPreference,
  value: boolean
): NotificationPreference => {
  const current = getGovernanceNotificationPreferences();
  const updated = { ...current, [key]: value };
  saveGovernanceNotificationPreferences(updated);
  return updated;
};

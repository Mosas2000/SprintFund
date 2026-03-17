import type { NotificationType } from '../types/notification';

const STORAGE_KEY = 'sprintfund-notification-preferences';

/**
 * Preference settings for each notification type.
 * Controls which notifications the user wants to receive.
 */
export interface NotificationPreferences {
  proposal_created: boolean;
  proposal_executed: boolean;
  vote_milestone: boolean;
  stake_change: boolean;
  vote_received: boolean;
  quorum_reached: boolean;
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  proposal_created: true,
  proposal_executed: true,
  vote_milestone: true,
  stake_change: true,
  vote_received: true,
  quorum_reached: true,
};

export const TYPE_LABELS: Record<NotificationType, string> = {
  proposal_created: 'New Proposals',
  proposal_executed: 'Executed Proposals',
  vote_milestone: 'Vote Milestones',
  stake_change: 'Stake Changes',
  vote_received: 'Votes Received',
  quorum_reached: 'Quorum Reached',
};

export const TYPE_DESCRIPTIONS: Record<NotificationType, string> = {
  proposal_created: 'When a new governance proposal is created',
  proposal_executed: 'When a proposal is executed on-chain',
  vote_milestone: 'When a proposal reaches a vote threshold',
  stake_change: 'When your staking position changes',
  vote_received: 'When your proposal receives a vote',
  quorum_reached: 'When a proposal reaches quorum',
};

export const NOTIFICATION_TYPES: NotificationType[] = [
  'proposal_created',
  'proposal_executed',
  'vote_milestone',
  'stake_change',
  'vote_received',
  'quorum_reached',
];

/**
 * Loads preferences from localStorage, falling back to defaults.
 */
export function loadPreferences(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    const parsed = JSON.parse(raw);
    const result = { ...DEFAULT_PREFERENCES };
    for (const key of Object.keys(DEFAULT_PREFERENCES) as NotificationType[]) {
      if (typeof parsed[key] === 'boolean') {
        result[key] = parsed[key];
      }
    }
    return result;
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

/**
 * Persists preferences to localStorage.
 */
export function savePreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Storage full or unavailable; silently fail
  }
}

/**
 * Checks whether a notification type is enabled per user preferences.
 */
export function isTypeEnabled(
  prefs: NotificationPreferences,
  type: NotificationType,
): boolean {
  return prefs[type] ?? true;
}

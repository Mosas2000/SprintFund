import { memo, useCallback, useState, useEffect } from 'react';
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
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  proposal_created: true,
  proposal_executed: true,
  vote_milestone: true,
  stake_change: true,
  vote_received: true,
};

const TYPE_LABELS: Record<NotificationType, string> = {
  proposal_created: 'New Proposals',
  proposal_executed: 'Executed Proposals',
  vote_milestone: 'Vote Milestones',
  stake_change: 'Stake Changes',
  vote_received: 'Votes Received',
};

const TYPE_DESCRIPTIONS: Record<NotificationType, string> = {
  proposal_created: 'When a new governance proposal is created',
  proposal_executed: 'When a proposal is executed on-chain',
  vote_milestone: 'When a proposal reaches a vote threshold',
  stake_change: 'When your staking position changes',
  vote_received: 'When your proposal receives a vote',
};

/**
 * Loads preferences from localStorage, falling back to defaults.
 */
export function loadPreferences(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    const parsed = JSON.parse(raw);
    // Validate shape: ensure all keys exist and are booleans
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

interface NotificationPreferencesProps {
  onClose?: () => void;
}

const NOTIFICATION_TYPES: NotificationType[] = [
  'proposal_created',
  'proposal_executed',
  'vote_milestone',
  'stake_change',
  'vote_received',
];

function NotificationPreferencesPanel({ onClose }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(loadPreferences);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const handleToggle = useCallback((type: NotificationType) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }, []);

  const handleEnableAll = useCallback(() => {
    setPreferences({ ...DEFAULT_PREFERENCES });
  }, []);

  const handleDisableAll = useCallback(() => {
    const disabled: NotificationPreferences = {
      proposal_created: false,
      proposal_executed: false,
      vote_milestone: false,
      stake_change: false,
      vote_received: false,
    };
    setPreferences(disabled);
  }, []);

  const enabledCount = NOTIFICATION_TYPES.filter((t) => preferences[t]).length;

  return (
    <div className="rounded-lg border border-border bg-dark p-4" role="region" aria-label="Notification preferences">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text">Notification Preferences</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-muted hover:text-text transition-colors"
            aria-label="Close preferences"
          >
            Done
          </button>
        )}
      </div>

      <div className="space-y-3">
        {NOTIFICATION_TYPES.map((type) => (
          <label
            key={type}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={preferences[type]}
              onChange={() => handleToggle(type)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-green"
              aria-describedby={`pref-desc-${type}`}
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-text group-hover:text-green transition-colors">
                {TYPE_LABELS[type]}
              </span>
              <p id={`pref-desc-${type}`} className="text-xs text-muted mt-0.5">
                {TYPE_DESCRIPTIONS[type]}
              </p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <span className="text-xs text-muted">
          {enabledCount} of {NOTIFICATION_TYPES.length} enabled
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleEnableAll}
            disabled={enabledCount === NOTIFICATION_TYPES.length}
            className="text-xs text-muted hover:text-green transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Enable all
          </button>
          <button
            onClick={handleDisableAll}
            disabled={enabledCount === 0}
            className="text-xs text-muted hover:text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Disable all
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(NotificationPreferencesPanel);

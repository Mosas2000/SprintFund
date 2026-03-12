import { memo, useEffect, useCallback, useRef } from 'react';
import type { Notification } from '../types/notification';

const TOAST_DURATION_MS = 5000;

export interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onAction?: (notification: Notification) => void;
  duration?: number;
}

/**
 * Returns a short label for the notification type.
 */
export function getToastLabel(type: Notification['type']): string {
  switch (type) {
    case 'proposal_created':
      return 'New Proposal';
    case 'proposal_executed':
      return 'Proposal Executed';
    case 'vote_milestone':
      return 'Vote Milestone';
    case 'stake_change':
      return 'Stake Update';
    case 'vote_received':
      return 'Vote Received';
    default:
      return 'Notification';
  }
}

/**
 * Returns a color class for the notification type accent.
 */
export function getToastAccentColor(type: Notification['type']): string {
  switch (type) {
    case 'proposal_created':
    case 'proposal_executed':
      return 'border-l-green';
    case 'vote_milestone':
      return 'border-l-amber-400';
    case 'stake_change':
      return 'border-l-blue-400';
    case 'vote_received':
      return 'border-l-purple-400';
    default:
      return 'border-l-green';
  }
}

/**
 * A brief auto-dismissing toast notification.
 * Appears at the bottom-right of the viewport and self-removes after
 * the configured duration. Supports click-to-action and manual dismiss.
 */
function NotificationToastComponent({
  notification,
  onDismiss,
  onAction,
  duration = TOAST_DURATION_MS,
}: NotificationToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDismiss = useCallback(() => {
    onDismiss(notification.id);
  }, [notification.id, onDismiss]);

  const handleAction = useCallback(() => {
    if (onAction) {
      onAction(notification);
    }
    handleDismiss();
  }, [notification, onAction, handleDismiss]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAction();
      }
    },
    [handleDismiss, handleAction],
  );

  useEffect(() => {
    timerRef.current = setTimeout(handleDismiss, duration);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleDismiss, duration]);

  const label = getToastLabel(notification.type);
  const accentColor = getToastAccentColor(notification.type);

  return (
    <div
      role="alert"
      aria-live="polite"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleAction}
      className={`
        pointer-events-auto cursor-pointer
        rounded-lg border border-border border-l-4 ${accentColor}
        bg-dark/95 backdrop-blur-sm p-3 shadow-lg
        transition-all duration-300 ease-out
        hover:bg-white/5
        max-w-sm w-full
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted">{label}</p>
          <p className="text-sm text-text mt-0.5 truncate">{notification.title}</p>
          {notification.description && (
            <p className="text-xs text-muted mt-1 line-clamp-2">
              {notification.description}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="shrink-0 text-muted hover:text-text transition-colors p-0.5"
          aria-label="Dismiss notification"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default memo(NotificationToastComponent);

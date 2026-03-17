import { memo, useCallback } from 'react';
import type { NotificationItemProps, NotificationType } from '../types/notification';
import { FOCUS_RING_GREEN } from '../lib/focus-styles';

/* ── Icon/label mapping per notification type ──── */

const TYPE_META: Record<NotificationType, { icon: string; color: string; label: string }> = {
  proposal_created:  { icon: '+',  color: 'text-green',  label: 'New Proposal' },
  proposal_executed: { icon: 'E',  color: 'text-green',  label: 'Executed' },
  vote_milestone:    { icon: 'M',  color: 'text-amber',  label: 'Milestone' },
  stake_change:      { icon: 'S',  color: 'text-blue-400', label: 'Stake' },
  vote_received:     { icon: 'V',  color: 'text-purple-400', label: 'Vote' },
  quorum_reached:    { icon: 'Q',  color: 'text-emerald-400', label: 'Quorum' },
};

/**
 * Format a timestamp into a short relative string.
 */
function relativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

/**
 * A single notification row in the dropdown list.
 *
 * Renders type icon, title, optional description, and relative timestamp.
 * Unread notifications have a left accent border and slightly highlighted
 * background.
 */
function NotificationItemBase({ notification, onClick }: NotificationItemProps) {
  const meta = TYPE_META[notification.type];

  const handleClick = useCallback(() => {
    onClick(notification);
  }, [notification, onClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(notification);
      }
    },
    [notification, onClick],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${meta.label}: ${notification.title}${notification.read ? '' : ' (unread)'}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`flex items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${FOCUS_RING_GREEN} ${
        notification.read
          ? 'hover:bg-white/5'
          : 'bg-green/5 border-l-2 border-green hover:bg-green/10'
      }`}
    >
      {/* Type icon */}
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold ${meta.color}`}
        aria-hidden="true"
      >
        {meta.icon}
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className={`text-sm leading-snug ${notification.read ? 'text-muted' : 'text-text font-medium'}`}>
          {notification.title}
        </p>
        {notification.description && (
          <p className="mt-0.5 text-xs text-muted truncate">
            {notification.description}
          </p>
        )}
        <p className="mt-1 text-[11px] text-muted/60">
          {relativeTime(notification.createdAt)}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.read && (
        <span
          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

const NotificationItem = memo(NotificationItemBase);
export default NotificationItem;

export { TYPE_META, relativeTime };

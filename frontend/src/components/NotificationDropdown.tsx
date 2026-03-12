import { memo, useCallback, useEffect, useRef } from 'react';
import type { NotificationDropdownProps } from '../types/notification';
import NotificationItem from './NotificationItem';
import { FOCUS_RING_GREEN } from '../lib/focus-styles';

/**
 * Dropdown panel that lists recent notifications with actions.
 *
 * Features:
 * - Scrollable notification list (max 320px height)
 * - "Mark all read" and "Clear all" action buttons
 * - Empty state message when no notifications exist
 * - Click-outside detection to close the dropdown
 * - Escape key to close
 * - Focus trap: first focusable element receives focus on open
 */
function NotificationDropdownBase({
  notifications,
  onNotificationClick,
  onMarkAllRead,
  onClearAll,
  onClose,
}: NotificationDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Click-outside detection ────────────────── */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  /* ── Focus first element on mount ───────────── */
  useEffect(() => {
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
      'button, [tabindex="0"]',
    );
    firstFocusable?.focus();
  }, []);

  const hasNotifications = notifications.length > 0;
  const hasUnread = notifications.some((n) => !n.read);

  const handleMarkAllRead = useCallback(() => {
    onMarkAllRead();
  }, [onMarkAllRead]);

  const handleClearAll = useCallback(() => {
    onClearAll();
  }, [onClearAll]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Notifications"
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-xl shadow-black/20 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-text">Notifications</h2>
        <div className="flex items-center gap-2">
          {hasUnread && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className={`text-xs text-green hover:text-green-dim transition-colors ${FOCUS_RING_GREEN} rounded px-1.5 py-0.5`}
            >
              Mark all read
            </button>
          )}
          {hasNotifications && (
            <button
              type="button"
              onClick={handleClearAll}
              className={`text-xs text-muted hover:text-text transition-colors ${FOCUS_RING_GREEN} rounded px-1.5 py-0.5`}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notification list */}
      {hasNotifications ? (
        <div
          className="max-h-80 overflow-y-auto divide-y divide-border"
          role="list"
          aria-label="Notification list"
        >
          {notifications.map((notification) => (
            <div key={notification.id} role="listitem">
              <NotificationItem
                notification={notification}
                onClick={onNotificationClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-muted">No notifications yet</p>
          <p className="mt-1 text-xs text-muted/60">
            You will be notified about new proposals, votes, and milestones.
          </p>
        </div>
      )}
    </div>
  );
}

const NotificationDropdown = memo(NotificationDropdownBase);
export default NotificationDropdown;

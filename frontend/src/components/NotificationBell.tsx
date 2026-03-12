import { memo } from 'react';
import type { NotificationBellProps } from '../types/notification';
import { FOCUS_RING_GREEN } from '../lib/focus-styles';

/**
 * Bell icon button for the header that shows the unread notification count.
 *
 * When clicked, toggles the notification dropdown. The badge is only
 * visible when unreadCount is greater than zero. Displays "9+" for
 * counts above 9 to keep the badge compact.
 */
function NotificationBellBase({ unreadCount, isOpen, onToggle }: NotificationBellProps) {
  const badgeText = unreadCount > 9 ? '9+' : String(unreadCount);
  const ariaLabel = unreadCount > 0
    ? `Notifications, ${unreadCount} unread`
    : 'Notifications';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      className={`relative rounded-md p-2 text-muted transition-colors hover:text-text hover:bg-white/5 ${FOCUS_RING_GREEN} ${
        isOpen ? 'bg-white/5 text-text' : ''
      }`}
    >
      {/* Bell SVG icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M10 2C7.79 2 6 3.79 6 6V9L4.29 10.71C4.11 10.89 4 11.15 4 11.41V12C4 12.55 4.45 13 5 13H15C15.55 13 16 12.55 16 12V11.41C16 11.15 15.89 10.89 15.71 10.71L14 9V6C14 3.79 12.21 2 10 2Z"
          fill="currentColor"
        />
        <path
          d="M10 18C11.1 18 12 17.1 12 16H8C8 17.1 8.9 18 10 18Z"
          fill="currentColor"
        />
      </svg>

      {/* Unread count badge */}
      {unreadCount > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-green px-1 text-[10px] font-bold text-dark leading-none"
          aria-hidden="true"
        >
          {badgeText}
        </span>
      )}
    </button>
  );
}

const NotificationBell = memo(NotificationBellBase);
export default NotificationBell;

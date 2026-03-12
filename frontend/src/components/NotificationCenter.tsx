import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import NotificationDropdown from './NotificationDropdown';
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useClearAllNotifications,
} from '../store/notification-selectors';
import type { Notification } from '../types/notification';

/**
 * Orchestrates the notification bell and dropdown.
 *
 * This is the single component that gets mounted in the Header.
 * It manages dropdown open/close state and wires store selectors
 * to the presentational child components.
 */
function NotificationCenterBase() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const notifications = useNotifications();
  const unreadCount = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const clearAll = useClearAllNotifications();

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      // Mark as read
      if (!notification.read) {
        markAsRead(notification.id);
      }

      // Navigate to the relevant proposal if applicable
      if (notification.proposalId !== undefined) {
        navigate(`/proposals/${notification.proposalId}`);
      }

      // Close dropdown
      setIsOpen(false);
    },
    [markAsRead, navigate],
  );

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const handleClearAll = useCallback(() => {
    clearAll();
    setIsOpen(false);
  }, [clearAll]);

  return (
    <div className="relative">
      <NotificationBell
        unreadCount={unreadCount}
        isOpen={isOpen}
        onToggle={handleToggle}
      />

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAllRead={handleMarkAllRead}
          onClearAll={handleClearAll}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

const NotificationCenter = memo(NotificationCenterBase);
export default NotificationCenter;

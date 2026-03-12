import { useNotificationsStore } from './notifications';
import type { Notification } from '../types/notification';

/* ── Read selectors ───────────────────────────── */

/** All notifications, newest first. */
export function useNotifications(): Notification[] {
  return useNotificationsStore((s) => s.notifications);
}

/** Count of unread notifications. */
export function useUnreadCount(): number {
  return useNotificationsStore((s) =>
    s.notifications.filter((n) => !n.read).length,
  );
}

/** Whether there are any unread notifications. */
export function useHasUnread(): boolean {
  return useNotificationsStore((s) =>
    s.notifications.some((n) => !n.read),
  );
}

/** Get notifications filtered by type. */
export function useNotificationsByType(type: string): Notification[] {
  return useNotificationsStore((s) =>
    s.notifications.filter((n) => n.type === type),
  );
}

/* ── Action selectors ─────────────────────────── */

export function useAddNotifications() {
  return useNotificationsStore((s) => s.addNotifications);
}

export function useMarkAsRead() {
  return useNotificationsStore((s) => s.markAsRead);
}

export function useMarkAllAsRead() {
  return useNotificationsStore((s) => s.markAllAsRead);
}

export function useRemoveNotification() {
  return useNotificationsStore((s) => s.removeNotification);
}

export function useClearAllNotifications() {
  return useNotificationsStore((s) => s.clearAll);
}

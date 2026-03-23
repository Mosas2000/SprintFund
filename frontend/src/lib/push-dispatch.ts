import type { Notification } from '../types/notification';
import { getPushPermission } from './push-permission';
import { TYPE_LABELS } from './notification-preferences';

export function dispatchPushNotification(notification: Notification): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (getPushPermission() !== 'granted') {
    return false;
  }

  const tag = `sprintfund-${notification.id}`;
  const label = TYPE_LABELS[notification.type] ?? 'Notification';

  new window.Notification(label, {
    body: notification.title,
    tag,
    icon: '/icon-192.png',
    silent: false,
  });

  return true;
}

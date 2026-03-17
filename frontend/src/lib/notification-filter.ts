import type { Notification, NotificationType } from '../types/notification';

export interface NotificationFilter {
  types?: NotificationType[];
  readState?: 'all' | 'read' | 'unread';
  fromTimestamp?: number;
  toTimestamp?: number;
  proposalId?: number;
}

export function filterNotifications(
  notifications: Notification[],
  filter: NotificationFilter,
): Notification[] {
  let result = notifications;

  if (filter.types && filter.types.length > 0) {
    const typeSet = new Set(filter.types);
    result = result.filter((n) => typeSet.has(n.type));
  }

  if (filter.readState === 'read') {
    result = result.filter((n) => n.read);
  } else if (filter.readState === 'unread') {
    result = result.filter((n) => !n.read);
  }

  if (filter.fromTimestamp !== undefined) {
    result = result.filter((n) => n.createdAt >= filter.fromTimestamp!);
  }

  if (filter.toTimestamp !== undefined) {
    result = result.filter((n) => n.createdAt <= filter.toTimestamp!);
  }

  if (filter.proposalId !== undefined) {
    result = result.filter((n) => n.proposalId === filter.proposalId);
  }

  return result;
}

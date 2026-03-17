import type { Notification, NotificationType } from '../types/notification';

export interface NotificationGroup {
  type: NotificationType;
  notifications: Notification[];
  latestTimestamp: number;
  unreadCount: number;
}

export function groupByType(notifications: Notification[]): NotificationGroup[] {
  const map = new Map<NotificationType, Notification[]>();

  for (const n of notifications) {
    const list = map.get(n.type) ?? [];
    list.push(n);
    map.set(n.type, list);
  }

  const groups: NotificationGroup[] = [];
  for (const [type, items] of map) {
    groups.push({
      type,
      notifications: items,
      latestTimestamp: Math.max(...items.map((n) => n.createdAt)),
      unreadCount: items.filter((n) => !n.read).length,
    });
  }

  groups.sort((a, b) => b.latestTimestamp - a.latestTimestamp);
  return groups;
}

export function groupByProposal(notifications: Notification[]): Map<number, Notification[]> {
  const map = new Map<number, Notification[]>();

  for (const n of notifications) {
    if (n.proposalId === undefined) continue;
    const list = map.get(n.proposalId) ?? [];
    list.push(n);
    map.set(n.proposalId, list);
  }

  return map;
}

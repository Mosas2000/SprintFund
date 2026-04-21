import { Notification } from '../types/notifications';

export const notificationBatch = (
  notifications: Notification[]
): Map<string, Notification[]> => {
  const batches = new Map<string, Notification[]>();

  for (const notif of notifications) {
    const key = notif.type;
    if (!batches.has(key)) {
      batches.set(key, []);
    }
    batches.get(key)!.push(notif);
  }

  return batches;
};

export const getNotificationPriority = (type: string): number => {
  const priorityMap: Record<string, number> = {
    proposalExecuted: 1,
    proposalCancelled: 2,
    proposalVoting: 3,
    proposalCreated: 4,
    delegationReceived: 5,
  };

  return priorityMap[type] ?? 999;
};

export const sortNotificationsByPriority = (
  notifications: Notification[]
): Notification[] => {
  return [...notifications].sort(
    (a, b) => getNotificationPriority(a.type) - getNotificationPriority(b.type)
  );
};

export const filterUnreadNotifications = (
  notifications: Notification[]
): Notification[] => {
  return notifications.filter(n => !n.read);
};

export const getNotificationStats = (notifications: Notification[]) => {
  return {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    byType: notifications.reduce(
      (acc, notif) => {
        acc[notif.type] = (acc[notif.type] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
};

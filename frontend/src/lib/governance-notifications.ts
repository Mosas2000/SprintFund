import { Notification, NotificationEvent, NotificationPreference } from '../types/notifications';

export const createGovernanceNotification = (
  type: keyof NotificationPreference,
  event: NotificationEvent
): Notification | null => {
  const baseId = `${type}-${Date.now()}`;

  switch (type) {
    case 'proposalCreated':
      return {
        id: baseId,
        type,
        title: 'New Proposal',
        message: event.proposalTitle 
          ? `New proposal: "${event.proposalTitle}"` 
          : 'A new proposal has been created',
        timestamp: Date.now(),
        read: false,
        actionUrl: event.proposalId 
          ? `/proposals/${event.proposalId}` 
          : undefined,
      };

    case 'proposalVoting':
      return {
        id: baseId,
        type,
        title: 'Voting Active',
        message: event.proposalTitle 
          ? `Voting is active on "${event.proposalTitle}"` 
          : 'Voting is now active on a proposal',
        timestamp: Date.now(),
        read: false,
        actionUrl: event.proposalId 
          ? `/proposals/${event.proposalId}` 
          : undefined,
      };

    case 'proposalExecuted':
      return {
        id: baseId,
        type,
        title: 'Proposal Executed',
        message: event.proposalTitle 
          ? `"${event.proposalTitle}" has been executed` 
          : 'A proposal has been executed',
        timestamp: Date.now(),
        read: false,
        actionUrl: event.proposalId 
          ? `/proposals/${event.proposalId}` 
          : undefined,
      };

    case 'proposalCancelled':
      return {
        id: baseId,
        type,
        title: 'Proposal Cancelled',
        message: event.proposalTitle 
          ? `"${event.proposalTitle}" has been cancelled` 
          : 'A proposal has been cancelled',
        timestamp: Date.now(),
        read: false,
        actionUrl: event.proposalId 
          ? `/proposals/${event.proposalId}` 
          : undefined,
      };

    case 'delegationReceived':
      return {
        id: baseId,
        type,
        title: 'Delegation Received',
        message: event.delegatorAddress
          ? `You received delegation from ${event.delegatorAddress.slice(0, 8)}...${event.delegatorAddress.slice(-4)}`
          : 'You have received delegation',
        timestamp: Date.now(),
        read: false,
      };

    default:
      return null;
  }
};

export const shouldNotifyGovernance = (
  type: keyof NotificationPreference,
  preferences: NotificationPreference
): boolean => {
  return preferences[type] ?? true;
};

export const deduplicateGovernanceNotifications = (
  notifications: Notification[],
  timeWindowMs: number = 30000
): Notification[] => {
  const seen = new Map<string, number>();
  const result: Notification[] = [];
  const now = Date.now();

  for (const notif of notifications) {
    const key = `${notif.type}-${notif.message}`;
    const lastSeen = seen.get(key);

    if (!lastSeen || now - lastSeen > timeWindowMs) {
      result.push(notif);
      seen.set(key, now);
    }
  }

  return result;
};

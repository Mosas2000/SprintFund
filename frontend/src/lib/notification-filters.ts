import type { Notification, NotificationType } from '../types/notification';
import type { NotificationPreferences } from './notification-preferences';

/**
 * Filter and sort utilities for notification lists.
 * Pure functions with no side effects or store dependencies.
 */

/**
 * Filters notifications by type.
 */
export function filterByType(
  notifications: Notification[],
  type: NotificationType,
): Notification[] {
  return notifications.filter((n) => n.type === type);
}

/**
 * Filters notifications to only unread items.
 */
export function filterUnread(notifications: Notification[]): Notification[] {
  return notifications.filter((n) => !n.read);
}

/**
 * Filters notifications to only read items.
 */
export function filterRead(notifications: Notification[]): Notification[] {
  return notifications.filter((n) => n.read);
}

/**
 * Filters notifications based on user preferences.
 * Only returns notifications whose type is enabled in preferences.
 */
export function filterByPreferences(
  notifications: Notification[],
  prefs: NotificationPreferences,
): Notification[] {
  return notifications.filter((n) => prefs[n.type] === true);
}

/**
 * Filters notifications within a time range.
 * Both bounds are inclusive. Omit a bound to leave that side open.
 */
export function filterByTimeRange(
  notifications: Notification[],
  options: { after?: number; before?: number },
): Notification[] {
  return notifications.filter((n) => {
    if (options.after !== undefined && n.createdAt < options.after) return false;
    if (options.before !== undefined && n.createdAt > options.before) return false;
    return true;
  });
}

/**
 * Filters notifications related to a specific proposal.
 */
export function filterByProposal(
  notifications: Notification[],
  proposalId: number,
): Notification[] {
  return notifications.filter((n) => n.proposalId === proposalId);
}

/**
 * Sorts notifications by createdAt timestamp in descending order (newest first).
 * Returns a new array; does not mutate the input.
 */
export function sortByNewest(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Sorts notifications by createdAt timestamp in ascending order (oldest first).
 * Returns a new array; does not mutate the input.
 */
export function sortByOldest(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => a.createdAt - b.createdAt);
}

/**
 * Groups notifications by their type.
 */
export function groupByType(
  notifications: Notification[],
): Record<NotificationType, Notification[]> {
  const groups: Record<NotificationType, Notification[]> = {
    proposal_created: [],
    proposal_executed: [],
    quorum_reached: [],
    vote_milestone: [],
    stake_change: [],
    vote_received: [],
  };
  for (const n of notifications) {
    groups[n.type].push(n);
  }
  return groups;
}

/**
 * Returns a summary object with counts per type.
 */
export function countByType(
  notifications: Notification[],
): Record<NotificationType, number> {
  const counts: Record<NotificationType, number> = {
    proposal_created: 0,
    proposal_executed: 0,
    quorum_reached: 0,
    vote_milestone: 0,
    stake_change: 0,
    vote_received: 0,
  };
  for (const n of notifications) {
    counts[n.type]++;
  }
  return counts;
}

/**
 * Searches notifications by title substring (case-insensitive).
 */
export function searchByTitle(
  notifications: Notification[],
  query: string,
): Notification[] {
  const lower = query.toLowerCase();
  return notifications.filter((n) => n.title.toLowerCase().includes(lower));
}

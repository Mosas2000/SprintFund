import type { NotificationType } from '../types/notification';

/**
 * Configuration for a notification badge category display.
 */
export interface BadgeConfig {
  type: NotificationType;
  label: string;
  color: string;
  bgColor: string;
}

/**
 * Badge configurations for each notification type.
 */
export const BADGE_CONFIGS: BadgeConfig[] = [
  {
    type: 'proposal_created',
    label: 'New',
    color: 'text-green',
    bgColor: 'bg-green/10',
  },
  {
    type: 'proposal_executed',
    label: 'Executed',
    color: 'text-green',
    bgColor: 'bg-green/10',
  },
  {
    type: 'vote_milestone',
    label: 'Milestone',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
  },
  {
    type: 'stake_change',
    label: 'Stake',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    type: 'vote_received',
    label: 'Vote',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
];

/**
 * Looks up the badge configuration for a notification type.
 * Returns undefined if the type is not recognized.
 */
export function getBadgeConfig(type: NotificationType): BadgeConfig | undefined {
  return BADGE_CONFIGS.find((b) => b.type === type);
}

/**
 * Returns the display label for a notification type badge.
 * Falls back to a capitalized version of the type if not found.
 */
export function getBadgeLabel(type: NotificationType): string {
  const config = getBadgeConfig(type);
  if (config) return config.label;
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Formats a count for display in a compact badge.
 * Shows exact number up to 99, then "99+" for larger values.
 */
export function formatBadgeCount(count: number): string {
  if (count <= 0) return '';
  if (count > 99) return '99+';
  return String(count);
}

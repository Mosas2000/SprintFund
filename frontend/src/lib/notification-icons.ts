import type { NotificationType } from '../types/notification';

const ICON_MAP: Record<NotificationType, string> = {
  proposal_created: 'FileText',
  proposal_executed: 'CheckCircle',
  vote_milestone: 'TrendingUp',
  stake_change: 'Coins',
  vote_received: 'Vote',
  quorum_reached: 'Target',
};

const COLOR_MAP: Record<NotificationType, string> = {
  proposal_created: 'text-blue-500',
  proposal_executed: 'text-green-500',
  vote_milestone: 'text-orange-500',
  stake_change: 'text-purple-500',
  vote_received: 'text-cyan-500',
  quorum_reached: 'text-emerald-500',
};

export function getNotificationIconName(type: NotificationType): string {
  return ICON_MAP[type] ?? 'Bell';
}

export function getNotificationColor(type: NotificationType): string {
  return COLOR_MAP[type] ?? 'text-slate-400';
}

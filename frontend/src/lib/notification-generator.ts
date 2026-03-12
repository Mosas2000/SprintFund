import type {
  Notification,
  NotificationType,
  ProposalSnapshot,
  MilestoneConfig,
} from '../types/notification';
import { DEFAULT_MILESTONES } from '../types/notification';
import { generateNotificationId } from '../store/notifications';

/**
 * Compares two proposal snapshots and produces notifications for
 * governance events that occurred between them.
 *
 * Detects:
 * - New proposals that appeared since last snapshot
 * - Proposals that transitioned to executed status
 * - Vote totals that crossed milestone thresholds
 */
export function compareSnapshots(
  previous: ProposalSnapshot,
  current: ProposalSnapshot,
  milestones: MilestoneConfig = DEFAULT_MILESTONES,
): Notification[] {
  const notifications: Notification[] = [];
  const now = Date.now();

  // Detect new proposals
  for (const id of current.knownIds) {
    if (!previous.knownIds.has(id)) {
      notifications.push({
        id: generateNotificationId(),
        type: 'proposal_created' as NotificationType,
        title: `New proposal #${id} created`,
        createdAt: now,
        read: false,
        proposalId: id,
      });
    }
  }

  // Detect newly executed proposals
  for (const id of current.executedIds) {
    if (!previous.executedIds.has(id)) {
      notifications.push({
        id: generateNotificationId(),
        type: 'proposal_executed' as NotificationType,
        title: `Proposal #${id} has been executed`,
        createdAt: now,
        read: false,
        proposalId: id,
      });
    }
  }

  // Detect vote milestone crossings
  for (const [id, currentVotes] of current.voteTotals) {
    const previousVotes = previous.voteTotals.get(id) ?? 0;
    if (currentVotes > previousVotes) {
      for (const threshold of milestones.thresholds) {
        if (previousVotes < threshold && currentVotes >= threshold) {
          notifications.push({
            id: generateNotificationId(),
            type: 'vote_milestone' as NotificationType,
            title: `Proposal #${id} reached ${threshold} votes`,
            createdAt: now,
            read: false,
            proposalId: id,
          });
        }
      }
    }
  }

  return notifications;
}

/**
 * Creates an empty snapshot for initial state or reset.
 */
export function createEmptySnapshot(): ProposalSnapshot {
  return {
    knownIds: new Set(),
    executedIds: new Set(),
    voteTotals: new Map(),
  };
}

/**
 * Builds a snapshot from raw proposal data arrays.
 * Useful for converting API responses into the snapshot format.
 */
export function buildSnapshot(
  proposals: Array<{ id: number; executed: boolean; voteCount: number }>,
): ProposalSnapshot {
  const knownIds = new Set<number>();
  const executedIds = new Set<number>();
  const voteTotals = new Map<number, number>();

  for (const p of proposals) {
    knownIds.add(p.id);
    if (p.executed) {
      executedIds.add(p.id);
    }
    voteTotals.set(p.id, p.voteCount);
  }

  return { knownIds, executedIds, voteTotals };
}

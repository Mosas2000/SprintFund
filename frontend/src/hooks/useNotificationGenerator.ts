import { useRef, useCallback } from 'react';
import type { ProposalSnapshot } from '../types/notification';
import {
  compareSnapshots,
  createEmptySnapshot,
  buildSnapshot,
} from '../lib/notification-generator';
import { useAddNotifications } from '../store/notification-selectors';

/**
 * Raw proposal shape expected from data sources.
 * Consumers pass whatever proposal data they have and the hook
 * normalises it into a ProposalSnapshot for comparison.
 */
export interface RawProposal {
  id: number;
  executed: boolean;
  voteCount: number;
}

/**
 * Hook that compares incoming proposal data against the last known
 * snapshot and dispatches any detected governance events as
 * notifications to the Zustand store.
 *
 * Usage:
 *   const processProposals = useNotificationGenerator();
 *   // Call whenever fresh data arrives:
 *   processProposals(proposals);
 */
export function useNotificationGenerator() {
  const snapshotRef = useRef<ProposalSnapshot>(createEmptySnapshot());
  const addNotifications = useAddNotifications();

  const processProposals = useCallback(
    (proposals: RawProposal[]) => {
      const current = buildSnapshot(proposals);
      const previous = snapshotRef.current;
      const notifications = compareSnapshots(previous, current);

      if (notifications.length > 0) {
        addNotifications(notifications);
      }

      snapshotRef.current = current;
    },
    [addNotifications],
  );

  return processProposals;
}

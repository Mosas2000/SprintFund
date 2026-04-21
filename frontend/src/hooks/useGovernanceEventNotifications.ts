'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useContractEvents } from './useContractEvents';
import { useNotifications } from './useNotifications';
import { getGovernanceNotificationPreferences } from '../lib/governance-notification-preferences';
import {
  createGovernanceNotification,
  shouldNotifyGovernance,
} from '../lib/governance-notifications';

interface UseGovernanceNotificationsOptions {
  contractPrincipal: string;
  apiUrl?: string;
  pollInterval?: number;
  enabled?: boolean;
}

export const useGovernanceEventNotifications = ({
  contractPrincipal,
  apiUrl,
  pollInterval,
  enabled = true,
}: UseGovernanceNotificationsOptions) => {
  const { addNotification } = useNotifications();
  const seenEventIds = useRef<Set<string>>(new Set());
  const preferences = useRef(getGovernanceNotificationPreferences());

  const handleNewEvent = useCallback(
    (event: any) => {
      if (!enabled || seenEventIds.current.has(event.id)) {
        return;
      }

      seenEventIds.current.add(event.id);

      const eventTypeMap: Record<string, keyof typeof preferences.current> = {
        proposal: 'proposalCreated',
        vote: 'proposalVoting',
        execute: 'proposalExecuted',
        cancel: 'proposalCancelled',
      };

      const notificationType = eventTypeMap[event.category];
      if (!notificationType) return;

      if (!shouldNotifyGovernance(notificationType, preferences.current)) {
        return;
      }

      const notification = createGovernanceNotification(notificationType, {
        proposalId: event.proposalId,
        proposalTitle: event.description,
      });

      if (notification) {
        addNotification(notification);
      }
    },
    [enabled, addNotification]
  );

  const { events, isLoading, error, refetch } = useContractEvents({
    contractPrincipal,
    apiUrl,
    pollInterval,
    onNewEvent: handleNewEvent,
  });

  useEffect(() => {
    preferences.current = getGovernanceNotificationPreferences();
  }, []);

  return {
    events,
    isLoading,
    error,
    refetch,
  };
};

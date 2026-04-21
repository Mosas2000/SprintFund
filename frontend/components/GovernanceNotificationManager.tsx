'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useNotifications } from '../src/hooks/useNotifications';
import { getGovernanceNotificationPreferences } from '../src/lib/governance-notification-preferences';
import {
  createGovernanceNotification,
  shouldNotifyGovernance,
  deduplicateGovernanceNotifications,
} from '../src/lib/governance-notifications';
import { NotificationContainer } from './NotificationDisplay';
import { NotificationPreferencesModal } from './NotificationPreferencesModal';
import { Bell, Settings } from 'lucide-react';

interface GovernanceNotificationManagerProps {
  contractPrincipal: string;
  pollInterval?: number;
}

export const GovernanceNotificationManager: React.FC<
  GovernanceNotificationManagerProps
> = ({ contractPrincipal, pollInterval = 30000 }) => {
  const {
    notifications,
    addNotification,
    dismissNotification,
  } = useNotifications();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState(
    getGovernanceNotificationPreferences()
  );
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const handleNavigation = useCallback((url: string) => {
    window.location.href = url;
  }, []);

  const handleSimulateProposalCreated = useCallback(() => {
    if (shouldNotifyGovernance('proposalCreated', preferences)) {
      const notif = createGovernanceNotification('proposalCreated', {
        proposalId: '123',
        proposalTitle: 'Sample Governance Proposal',
      });
      if (notif) {
        addNotification(notif);
      }
    }
  }, [preferences, addNotification]);

  const handleSimulateProposalExecuted = useCallback(() => {
    if (shouldNotifyGovernance('proposalExecuted', preferences)) {
      const notif = createGovernanceNotification('proposalExecuted', {
        proposalId: '123',
        proposalTitle: 'Sample Governance Proposal',
      });
      if (notif) {
        addNotification(notif);
      }
    }
  }, [preferences, addNotification]);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setPreferencesOpen(true)}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center relative"
            title="Notification settings"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={() => setPreferencesOpen(true)}
          className="p-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors shadow-lg"
          title="Notification preferences"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <NotificationContainer
        notifications={notifications}
        onDismiss={dismissNotification}
        onAction={handleNavigation}
      />

      <NotificationPreferencesModal
        isOpen={preferencesOpen}
        onClose={() => {
          setPreferencesOpen(false);
          setPreferences(getGovernanceNotificationPreferences());
        }}
      />
    </>
  );
};

export default GovernanceNotificationManager;

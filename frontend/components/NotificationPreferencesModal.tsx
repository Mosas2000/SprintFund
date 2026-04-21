'use client';

import React, { useState, useCallback } from 'react';
import {
  getGovernanceNotificationPreferences,
  saveGovernanceNotificationPreferences,
} from '../src/lib/governance-notification-preferences';
import { NotificationPreference } from '../src/types/notifications';
import { Bell, Check, X } from 'lucide-react';

const preferenceLabels: Record<keyof NotificationPreference, string> = {
  proposalCreated: 'New Proposals',
  proposalVoting: 'Voting Updates',
  proposalExecuted: 'Executed Proposals',
  proposalCancelled: 'Cancelled Proposals',
  delegationReceived: 'Delegation Received',
};

const preferenceDescriptions: Record<keyof NotificationPreference, string> = {
  proposalCreated: 'Get notified when a new proposal is created',
  proposalVoting: 'Get notified when voting becomes active',
  proposalExecuted: 'Get notified when a proposal is executed',
  proposalCancelled: 'Get notified when a proposal is cancelled',
  delegationReceived: 'Get notified when you receive delegation',
};

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [preferences, setPreferences] = useState<NotificationPreference>(
    getGovernanceNotificationPreferences()
  );
  const [saved, setSaved] = useState(false);

  const handleToggle = useCallback(
    (key: keyof NotificationPreference) => {
      setPreferences(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
      setSaved(false);
    },
    []
  );

  const handleSave = useCallback(() => {
    saveGovernanceNotificationPreferences(preferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [preferences]);

  const handleEnableAll = useCallback(() => {
    const allEnabled: NotificationPreference = {
      proposalCreated: true,
      proposalVoting: true,
      proposalExecuted: true,
      proposalCancelled: true,
      delegationReceived: true,
    };
    setPreferences(allEnabled);
    setSaved(false);
  }, []);

  const handleDisableAll = useCallback(() => {
    const allDisabled: NotificationPreference = {
      proposalCreated: false,
      proposalVoting: false,
      proposalExecuted: false,
      proposalCancelled: false,
      delegationReceived: false,
    };
    setPreferences(allDisabled);
    setSaved(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Notification Preferences
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Choose which governance events you want to be notified about
          </p>
        </div>

        <div className="p-6 space-y-4">
          {(Object.keys(preferenceLabels) as Array<keyof NotificationPreference>).map(
            key => (
              <label key={key} className="flex items-start gap-3 cursor-pointer">
                <div className="mt-1">
                  <input
                    type="checkbox"
                    checked={preferences[key]}
                    onChange={() => handleToggle(key)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{preferenceLabels[key]}</div>
                  <p className="text-sm text-gray-600">{preferenceDescriptions[key]}</p>
                </div>
              </label>
            )
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 space-y-3">
          <div className="flex gap-2 text-xs">
            <button
              onClick={handleEnableAll}
              className="flex-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              Enable All
            </button>
            <button
              onClick={handleDisableAll}
              className="flex-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Disable All
            </button>
          </div>

          {saved && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded text-sm">
              <Check className="h-4 w-4" />
              Preferences saved
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferencesModal;

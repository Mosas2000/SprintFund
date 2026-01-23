'use client';

import { useState, useEffect } from 'react';

interface Notification {
  id: number;
  type: 'vote_cast' | 'threshold_reached' | 'proposal_passed' | 'proposal_failed' | 'delegation_received';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  proposalId?: number;
}

interface VoteNotificationProps {
  userAddress: string;
}

export default function VoteNotification({ userAddress }: VoteNotificationProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [settings, setSettings] = useState({
    voteAlerts: true,
    thresholdAlerts: true,
    resultAlerts: true,
    delegationAlerts: true,
    emailNotifications: false
  });

  useEffect(() => {
    const stored = localStorage.getItem(`notifications-${userAddress}`);
    if (stored) {
      setNotifications(JSON.parse(stored));
    }

    const storedSettings = localStorage.getItem(`notification-settings-${userAddress}`);
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, [userAddress]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem(`notifications-${userAddress}`, JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(`notifications-${userAddress}`, JSON.stringify(updated));
  };

  const clearNotification = (id: number) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem(`notifications-${userAddress}`, JSON.stringify(updated));
  };

  const updateSettings = (key: string, value: boolean) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem(`notification-settings-${userAddress}`, JSON.stringify(updated));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'vote_cast': return '🗳️';
      case 'threshold_reached': return '🎯';
      case 'proposal_passed': return '✅';
      case 'proposal_failed': return '❌';
      case 'delegation_received': return '🤝';
      default: return '🔔';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold
                         rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 
                      rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Settings Toggle */}
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                ⚙️ Notification Settings
              </summary>
              <div className="mt-3 space-y-2 pl-2">
                {Object.entries(settings).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateSettings(key, e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-xs">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </details>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔕</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 
                           dark:hover:bg-gray-900 transition ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getIcon(notif.type)}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{notif.title}</div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(notif.timestamp).toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={() => clearNotification(notif.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

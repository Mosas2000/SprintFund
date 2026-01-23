'use client';

import { useState, useEffect } from 'react';

interface Notification {
  id: number;
  type: 'proposal' | 'vote' | 'comment' | 'mention' | 'achievement' | 'delegation' | 'treasury' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: {
    proposalId?: number;
    userAddress?: string;
    amount?: number;
  };
}

interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  digestMode: 'instant' | 'daily' | 'weekly';
  categories: {
    proposals: boolean;
    votes: boolean;
    comments: boolean;
    mentions: boolean;
    achievements: boolean;
    treasury: boolean;
    system: boolean;
  };
}

interface NotificationCenterProps {
  userAddress: string;
}

export default function NotificationCenter({ userAddress }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailEnabled: true,
    pushEnabled: false,
    digestMode: 'instant',
    categories: {
      proposals: true,
      votes: true,
      comments: true,
      mentions: true,
      achievements: true,
      treasury: true,
      system: true
    }
  });

  useEffect(() => {
    // Load notifications
    const mockNotifications: Notification[] = [
      {
        id: 1,
        type: 'proposal',
        title: 'New Proposal Submitted',
        message: 'alice_dao created "DeFi Lending Protocol v2" proposal',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        read: false,
        priority: 'high',
        actionUrl: '/proposals/42',
        metadata: { proposalId: 42, userAddress: 'SP1ABC...DEF' }
      },
      {
        id: 2,
        type: 'vote',
        title: 'Proposal Voting Ending Soon',
        message: 'Only 6 hours left to vote on "Community NFT Marketplace"',
        timestamp: Date.now() - 4 * 60 * 60 * 1000,
        read: false,
        priority: 'high',
        actionUrl: '/proposals/28'
      },
      {
        id: 3,
        type: 'achievement',
        title: 'New Achievement Unlocked!',
        message: 'You earned the "Top Contributor" badge 🏆',
        timestamp: Date.now() - 12 * 60 * 60 * 1000,
        read: true,
        priority: 'medium'
      },
      {
        id: 4,
        type: 'comment',
        title: 'New Comment on Your Proposal',
        message: 'bob_builder commented on your proposal #15',
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        read: false,
        priority: 'medium',
        actionUrl: '/proposals/15#comments'
      },
      {
        id: 5,
        type: 'mention',
        title: 'You were mentioned',
        message: 'carol_artist mentioned you in a comment',
        timestamp: Date.now() - 36 * 60 * 60 * 1000,
        read: true,
        priority: 'low'
      },
      {
        id: 6,
        type: 'treasury',
        title: 'Treasury Transaction',
        message: '75,000 STX distributed to approved proposal',
        timestamp: Date.now() - 48 * 60 * 60 * 1000,
        read: true,
        priority: 'medium',
        metadata: { amount: 75000 }
      },
      {
        id: 7,
        type: 'delegation',
        title: 'Voting Power Delegated',
        message: 'dave_investor delegated 5,000 voting power to you',
        timestamp: Date.now() - 72 * 60 * 60 * 1000,
        read: true,
        priority: 'medium',
        metadata: { amount: 5000, userAddress: 'SP4STU...VWX' }
      },
      {
        id: 8,
        type: 'system',
        title: 'System Update',
        message: 'New features available: Dashboard customization and insights',
        timestamp: Date.now() - 96 * 60 * 60 * 1000,
        read: true,
        priority: 'low'
      }
    ];

    setNotifications(mockNotifications);

    // Load preferences
    const savedPrefs = localStorage.getItem(`notification-prefs-${userAddress}`);
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, [userAddress]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    if (confirm('Clear all notifications?')) {
      setNotifications([]);
    }
  };

  const savePreferences = () => {
    localStorage.setItem(`notification-prefs-${userAddress}`, JSON.stringify(preferences));
    alert('Preferences saved!');
    setShowSettings(false);
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      proposal: '📝',
      vote: '🗳️',
      comment: '💬',
      mention: '👤',
      achievement: '🏆',
      delegation: '🔄',
      treasury: '💰',
      system: '⚙️'
    };
    return icons[type as keyof typeof icons] || '📢';
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'high') return n.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">🔔 Notification Center</h2>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium 
                     hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            ⚙️ Settings
          </button>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 
                     disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            Mark All Read
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'high'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          High Priority ({notifications.filter(n => n.priority === 'high').length})
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">Notification Settings</h3>
          
          <div className="space-y-6">
            {/* Delivery Methods */}
            <div>
              <h4 className="font-medium mb-3">Delivery Methods</h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <input
                    type="checkbox"
                    checked={preferences.emailEnabled}
                    onChange={(e) => setPreferences({ ...preferences, emailEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={preferences.pushEnabled}
                    onChange={(e) => setPreferences({ ...preferences, pushEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            {/* Digest Mode */}
            <div>
              <h4 className="font-medium mb-3">Digest Mode</h4>
              <select
                value={preferences.digestMode}
                onChange={(e) => setPreferences({ ...preferences, digestMode: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="instant">Instant (Real-time)</option>
                <option value="daily">Daily Digest (8:00 AM)</option>
                <option value="weekly">Weekly Digest (Monday)</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-medium mb-3">Notification Categories</h4>
              <div className="space-y-2">
                {Object.entries(preferences.categories).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{key}</span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        categories: { ...preferences.categories, [key]: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={savePreferences}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium
                         hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📭</div>
            <div>No notifications</div>
            <div className="text-sm">You're all caught up!</div>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-gray-800 rounded-lg border p-4 transition ${
                notification.read
                  ? 'border-gray-200 dark:border-gray-700'
                  : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-3xl">{getNotificationIcon(notification.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <div className="flex items-center gap-2">
                      {notification.priority === 'high' && (
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 
                                     rounded text-xs font-medium">
                          High Priority
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {notification.message}
                  </p>

                  {notification.actionUrl && (
                    <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                      View Details →
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

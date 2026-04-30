'use client';

import React, { useState } from 'react';
import { useNotifications } from '../src/hooks/useNotifications';
import { useGovernanceEventNotifications } from '../src/hooks/useGovernanceEventNotifications';
import { Bell } from 'lucide-react';

interface NotificationCenterProps {
  contractPrincipal: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  contractPrincipal,
}) => {
  const {
    notifications,
    dismissNotification,
    markAsRead,
    clearAll,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  useGovernanceEventNotifications({
    contractPrincipal,
    enabled: true,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    notif.read ? '' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-gray-700 mt-1">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full" />
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      {notif.read ? 'Mark unread' : 'Mark read'}
                    </button>
                    <button
                      onClick={() => dismissNotification(notif.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => clearAll()}
                className="w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

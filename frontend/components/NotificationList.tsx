'use client';

import React from 'react';
import { Notification } from '../src/types/notifications';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onDismiss,
  onDismissAll,
}) => {
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) {
      return 'just now';
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Notifications {notifications.length > 0 && `(${notifications.length})`}
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={onDismissAll}
            className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                notif.read ? 'bg-gray-50' : 'bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {notif.title}
                      </h4>
                      <p className="text-sm text-gray-700 mt-1">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="flex-shrink-0 inline-block h-2 w-2 bg-blue-600 rounded-full" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {formatTime(notif.timestamp)}
                  </div>
                  {notif.actionUrl && (
                    <a
                      href={notif.actionUrl}
                      className="text-xs text-blue-600 hover:text-blue-700 mt-2 inline-block"
                    >
                      View Details →
                    </a>
                  )}
                </div>

                <div className="flex-shrink-0 flex gap-1">
                  <button
                    onClick={() => onMarkAsRead(notif.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
                    title={notif.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {notif.read ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onDismiss(notif.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
                    title="Dismiss"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;

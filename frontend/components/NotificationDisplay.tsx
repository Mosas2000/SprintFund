'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Notification } from '../src/types/notifications';
import { Bell, X, CheckCircle } from 'lucide-react';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onAction?: (actionUrl: string) => void;
}

const notificationIcons: Record<Notification['type'], typeof Bell> = {
  proposalCreated: Bell,
  proposalVoting: Bell,
  proposalExecuted: CheckCircle,
  proposalCancelled: X,
  delegationReceived: Bell,
};

const notificationColors: Record<Notification['type'], string> = {
  proposalCreated: 'bg-blue-50 border-blue-200 text-blue-900',
  proposalVoting: 'bg-purple-50 border-purple-200 text-purple-900',
  proposalExecuted: 'bg-green-50 border-green-200 text-green-900',
  proposalCancelled: 'bg-red-50 border-red-200 text-red-900',
  delegationReceived: 'bg-amber-50 border-amber-200 text-amber-900',
};

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  onAction,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(notification.id), 300);
    }, 6000);

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const Icon = notificationIcons[notification.type];

  const handleAction = useCallback(() => {
    if (notification.actionUrl && onAction) {
      onAction(notification.actionUrl);
    }
    setIsExiting(true);
    setTimeout(() => onDismiss(notification.id), 300);
  }, [notification, onDismiss, onAction]);

  return (
    <div
      className={`border rounded-lg p-4 flex items-start gap-3 transition-opacity duration-300 ${
        notificationColors[notification.type]
      } ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm">{notification.title}</h3>
        <p className="text-sm mt-1">{notification.message}</p>
        {notification.actionUrl && (
          <button
            onClick={handleAction}
            className="text-xs font-medium underline hover:no-underline mt-2"
          >
            View →
          </button>
        )}
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onDismiss(notification.id), 300);
        }}
        className="flex-shrink-0 text-current opacity-50 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onAction?: (actionUrl: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onDismiss,
  onAction,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notif => (
        <NotificationToast
          key={notif.id}
          notification={notif}
          onDismiss={onDismiss}
          onAction={onAction}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;

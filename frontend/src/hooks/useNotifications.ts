'use client';

import React, { useReducer, useCallback } from 'react';
import { Notification } from '../src/types/notifications';

interface NotificationState {
  notifications: Notification[];
}

type NotificationAction =
  | { type: 'ADD'; payload: Notification }
  | { type: 'DISMISS'; payload: string }
  | { type: 'MARK_READ'; payload: string }
  | { type: 'CLEAR' };

const notificationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case 'ADD':
      return {
        notifications: [action.payload, ...state.notifications],
      };

    case 'DISMISS':
      return {
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case 'MARK_READ':
      return {
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'CLEAR':
      return {
        notifications: [],
      };

    default:
      return state;
  }
};

const initialState: NotificationState = {
  notifications: [],
};

interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = useCallback((notification: Notification) => {
    dispatch({ type: 'ADD', payload: notification });
  }, []);

  const dismissNotification = useCallback((id: string) => {
    dispatch({ type: 'DISMISS', payload: id });
  }, []);

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_READ', payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return {
    notifications: state.notifications,
    addNotification,
    dismissNotification,
    markAsRead,
    clearAll,
  };
};

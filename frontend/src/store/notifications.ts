import { create } from 'zustand';
import type { Notification, NotificationsState } from '../types/notification';

/* ── Constants ────────────────────────────────── */

const STORAGE_KEY = 'sprintfund-notifications';
const MAX_NOTIFICATIONS = 100;

/* ── localStorage helpers ─────────────────────── */

function loadFromStorage(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveToStorage(notifications: Notification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    /* Storage full or unavailable */
  }
}

/* ── ID generation ────────────────────────────── */

let idCounter = 0;

export function generateNotificationId(): string {
  idCounter += 1;
  return `notif-${Date.now()}-${idCounter}`;
}

/* ── Store ────────────────────────────────────── */

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: loadFromStorage(),

  addNotifications: (items: Notification[]) => {
    if (items.length === 0) return;

    const current = get().notifications;
    const existingIds = new Set(current.map((n) => n.id));

    // Filter duplicates
    const newItems = items.filter((item) => !existingIds.has(item.id));
    if (newItems.length === 0) return;

    // Prepend new items, sort descending by createdAt, cap at max
    const merged = [...newItems, ...current]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, MAX_NOTIFICATIONS);

    set({ notifications: merged });
    saveToStorage(merged);
  },

  markAsRead: (id: string) => {
    const notifications = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    set({ notifications });
    saveToStorage(notifications);
  },

  markAllAsRead: () => {
    const notifications = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications });
    saveToStorage(notifications);
  },

  removeNotification: (id: string) => {
    const notifications = get().notifications.filter((n) => n.id !== id);
    set({ notifications });
    saveToStorage(notifications);
  },

  clearAll: () => {
    set({ notifications: [] });
    saveToStorage([]);
  },
}));

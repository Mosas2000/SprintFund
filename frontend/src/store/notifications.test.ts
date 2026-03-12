import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/* ── localStorage mock ────────────────────────── */

const mockStorage = new Map<string, string>();

const localStorageMock = {
  getItem: vi.fn((key: string) => mockStorage.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => { mockStorage.set(key, value); }),
  removeItem: vi.fn((key: string) => { mockStorage.delete(key); }),
  clear: vi.fn(() => { mockStorage.clear(); }),
  get length() { return mockStorage.size; },
  key: vi.fn(() => null),
};

beforeEach(() => {
  mockStorage.clear();
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  mockStorage.clear();
});

/* ── Helpers ──────────────────────────────────── */

function makeNotification(overrides: Record<string, unknown> = {}) {
  return {
    id: `notif-${Math.random()}`,
    type: 'proposal_created' as const,
    title: 'Test Notification',
    createdAt: Date.now(),
    read: false,
    ...overrides,
  };
}

describe('notifications store', () => {
  describe('initial state', () => {
    it('starts with empty notifications when localStorage is empty', async () => {
      const { useNotificationsStore } = await import('./notifications');
      const state = useNotificationsStore.getState();
      expect(state.notifications).toEqual([]);
    });

    it('hydrates from localStorage on creation', async () => {
      const stored = [makeNotification({ id: 'stored-1' })];
      mockStorage.set('sprintfund-notifications', JSON.stringify(stored));

      // Force re-import by clearing module cache
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const state = useNotificationsStore.getState();
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].id).toBe('stored-1');
    });

    it('handles corrupt localStorage gracefully', async () => {
      mockStorage.set('sprintfund-notifications', 'not-json');
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const state = useNotificationsStore.getState();
      expect(state.notifications).toEqual([]);
    });

    it('handles non-array localStorage value gracefully', async () => {
      mockStorage.set('sprintfund-notifications', JSON.stringify({ bad: true }));
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const state = useNotificationsStore.getState();
      expect(state.notifications).toEqual([]);
    });
  });

  describe('addNotifications', () => {
    it('adds new notifications and persists to localStorage', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const store = useNotificationsStore.getState();

      const items = [makeNotification({ id: 'a1', createdAt: 1000 })];
      store.addNotifications(items);

      const updated = useNotificationsStore.getState().notifications;
      expect(updated).toHaveLength(1);
      expect(updated[0].id).toBe('a1');

      // Check localStorage was called
      const stored = JSON.parse(mockStorage.get('sprintfund-notifications') || '[]');
      expect(stored).toHaveLength(1);
    });

    it('deduplicates by id', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const store = useNotificationsStore.getState();

      const item = makeNotification({ id: 'dup-1', createdAt: 1000 });
      store.addNotifications([item]);
      store.addNotifications([item]); // Same id

      const updated = useNotificationsStore.getState().notifications;
      expect(updated).toHaveLength(1);
    });

    it('sorts newest first', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const store = useNotificationsStore.getState();

      store.addNotifications([
        makeNotification({ id: 'old', createdAt: 1000 }),
        makeNotification({ id: 'new', createdAt: 5000 }),
        makeNotification({ id: 'mid', createdAt: 3000 }),
      ]);

      const ids = useNotificationsStore.getState().notifications.map((n) => n.id);
      expect(ids).toEqual(['new', 'mid', 'old']);
    });

    it('caps at 100 notifications', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const store = useNotificationsStore.getState();

      const items = Array.from({ length: 110 }, (_, i) =>
        makeNotification({ id: `cap-${i}`, createdAt: i }),
      );
      store.addNotifications(items);

      expect(useNotificationsStore.getState().notifications).toHaveLength(100);
    });

    it('does nothing when given an empty array', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const before = useNotificationsStore.getState().notifications;
      useNotificationsStore.getState().addNotifications([]);
      const after = useNotificationsStore.getState().notifications;
      expect(after).toBe(before);
    });
  });

  describe('markAsRead', () => {
    it('marks a specific notification as read', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const store = useNotificationsStore.getState();

      store.addNotifications([makeNotification({ id: 'r1', createdAt: 1000, read: false })]);
      store.markAsRead('r1');

      const n = useNotificationsStore.getState().notifications.find((n) => n.id === 'r1');
      expect(n?.read).toBe(true);
    });

    it('does not affect other notifications', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const store = useNotificationsStore.getState();

      store.addNotifications([
        makeNotification({ id: 'r2', createdAt: 2000, read: false }),
        makeNotification({ id: 'r3', createdAt: 1000, read: false }),
      ]);
      store.markAsRead('r2');

      const r3 = useNotificationsStore.getState().notifications.find((n) => n.id === 'r3');
      expect(r3?.read).toBe(false);
    });

    it('persists read state to localStorage', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const store = useNotificationsStore.getState();

      store.addNotifications([makeNotification({ id: 'r4', createdAt: 1000, read: false })]);
      store.markAsRead('r4');

      const stored = JSON.parse(mockStorage.get('sprintfund-notifications') || '[]');
      expect(stored[0].read).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('marks every notification as read', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const store = useNotificationsStore.getState();

      store.addNotifications([
        makeNotification({ id: 'a1', createdAt: 2000, read: false }),
        makeNotification({ id: 'a2', createdAt: 1000, read: false }),
      ]);
      store.markAllAsRead();

      const all = useNotificationsStore.getState().notifications;
      expect(all.every((n) => n.read)).toBe(true);
    });
  });

  describe('removeNotification', () => {
    it('removes a notification by id', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const store = useNotificationsStore.getState();

      store.addNotifications([
        makeNotification({ id: 'del-1', createdAt: 2000 }),
        makeNotification({ id: 'del-2', createdAt: 1000 }),
      ]);
      store.removeNotification('del-1');

      const remaining = useNotificationsStore.getState().notifications;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('del-2');
    });

    it('persists removal to localStorage', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const store = useNotificationsStore.getState();

      store.addNotifications([makeNotification({ id: 'del-3', createdAt: 1000 })]);
      store.removeNotification('del-3');

      const stored = JSON.parse(mockStorage.get('sprintfund-notifications') || '[]');
      expect(stored).toHaveLength(0);
    });
  });

  describe('clearAll', () => {
    it('removes all notifications', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const store = useNotificationsStore.getState();

      store.addNotifications([
        makeNotification({ id: 'c1', createdAt: 2000 }),
        makeNotification({ id: 'c2', createdAt: 1000 }),
      ]);
      store.clearAll();

      expect(useNotificationsStore.getState().notifications).toEqual([]);
    });

    it('clears localStorage', async () => {
      vi.resetModules();
      const { useNotificationsStore } = await import('./notifications');
      const store = useNotificationsStore.getState();

      store.addNotifications([makeNotification({ id: 'c3', createdAt: 1000 })]);
      store.clearAll();

      const stored = JSON.parse(mockStorage.get('sprintfund-notifications') || '[]');
      expect(stored).toEqual([]);
    });
  });

  describe('generateNotificationId', () => {
    it('produces unique ids', async () => {
      vi.resetModules();
      const { generateNotificationId } = await import('./notifications');

      const ids = new Set<string>();
      for (let i = 0; i < 50; i++) {
        ids.add(generateNotificationId());
      }
      expect(ids.size).toBe(50);
    });

    it('ids start with notif- prefix', async () => {
      vi.resetModules();
      const { generateNotificationId } = await import('./notifications');
      expect(generateNotificationId()).toMatch(/^notif-/);
    });
  });
});

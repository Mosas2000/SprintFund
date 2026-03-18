import { describe, it, expect, beforeEach } from 'vitest';
import { TypedStorage, SessionCache, PersistentCache } from './typed-storage';

describe('TypedStorage', () => {
  let storage: TypedStorage;
  let mockStore: Record<string, string>;

  beforeEach(() => {
    mockStore = {};
    const mockStorage: Storage = {
      getItem: (key) => mockStore[key] ?? null,
      setItem: (key, value) => {
        mockStore[key] = value;
      },
      removeItem: (key) => {
        delete mockStore[key];
      },
      clear: () => {
        Object.keys(mockStore).forEach((k) => delete mockStore[k]);
      },
      length: Object.keys(mockStore).length,
      key: (index) => Object.keys(mockStore)[index] ?? null,
    };
    storage = new TypedStorage(mockStorage);
  });

  describe('set and get', () => {
    it('stores and retrieves values', () => {
      storage.set('key', { value: 42 });
      const result = storage.get('key');
      expect((result as { value: number }).value).toBe(42);
    });

    it('returns null for missing keys', () => {
      expect(storage.get('nonexistent')).toBeNull();
    });

    it('handles custom marshaling', () => {
      storage.set('key', 100, (v) => `value:${v}`);
      const result = storage.get('key', (s) => parseInt(s.split(':')[1], 10));
      expect(result).toBe(100);
    });
  });

  describe('remove', () => {
    it('removes values', () => {
      storage.set('key', 'value');
      expect(storage.has('key')).toBe(true);
      storage.remove('key');
      expect(storage.has('key')).toBe(false);
    });
  });

  describe('clear', () => {
    it('clears all values', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      storage.clear();
      expect(storage.has('key1')).toBe(false);
      expect(storage.has('key2')).toBe(false);
    });
  });
});

describe('SessionCache', () => {
  let cache: SessionCache;

  beforeEach(() => {
    cache = new SessionCache();
    cache.clear();
  });

  it('stores session data', () => {
    cache.set('user', { id: 1, name: 'Test' });
    const result = cache.get('user');
    expect((result as { id: number }).id).toBe(1);
  });

  it('clears session data', () => {
    cache.set('key', 'value');
    cache.clear();
    expect(cache.get('key')).toBeNull();
  });
});

describe('PersistentCache', () => {
  let cache: PersistentCache;

  beforeEach(() => {
    cache = new PersistentCache();
    cache.clear();
  });

  describe('TTL handling', () => {
    it('stores values with TTL', () => {
      const now = Date.now();
      cache.set('key', 'value', 10); // 10 seconds
      expect(cache.get('key')).toBe('value');
    });

    it('detects expired values', () => {
      cache.set('key', 'value', -1); // Already expired
      expect(cache.isExpired('key')).toBe(true);
    });

    it('returns null for expired values', () => {
      cache.set('key', 'value', -1);
      expect(cache.get('key')).toBeNull();
    });
  });

  describe('persistent storage', () => {
    it('stores data persistently', () => {
      cache.set('persistent', { data: 'value' });
      const result = cache.get('persistent');
      expect((result as { data: string }).data).toBe('value');
    });
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LocalStorageCache } from './persistent-cache';

describe('LocalStorageCache', () => {
  let cache: LocalStorageCache;

  beforeEach(() => {
    cache = new LocalStorageCache();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('set and get', () => {
    it('should store and retrieve data', () => {
      const data = { id: 1, name: 'Test' };
      cache.set('test', data, 60000);

      const retrieved = cache.get<typeof data>('test');
      expect(retrieved).toEqual(data);
    });

    it('should return null for non-existent keys', () => {
      const retrieved = cache.get('nonexistent');
      expect(retrieved).toBeNull();
    });

    it('should store different types', () => {
      cache.set('number', 42, 60000);
      cache.set('string', 'hello', 60000);
      cache.set('array', [1, 2, 3], 60000);
      cache.set('boolean', true, 60000);

      expect(cache.get('number')).toBe(42);
      expect(cache.get('string')).toBe('hello');
      expect(cache.get('array')).toEqual([1, 2, 3]);
      expect(cache.get('boolean')).toBe(true);
    });
  });

  describe('expiration', () => {
    it('should expire cached data after TTL', () => {
      vi.useFakeTimers();
      cache.set('test', { data: 'value' }, 1000);

      expect(cache.get('test')).toBeTruthy();

      vi.advanceTimersByTime(1100);

      expect(cache.get('test')).toBeNull();

      vi.useRealTimers();
    });

    it('should not expire data before TTL', () => {
      vi.useFakeTimers();
      cache.set('test', { data: 'value' }, 1000);

      vi.advanceTimersByTime(500);

      expect(cache.get('test')).toBeTruthy();

      vi.useRealTimers();
    });
  });

  describe('remove', () => {
    it('should remove cached data', () => {
      cache.set('test', { data: 'value' }, 60000);
      expect(cache.get('test')).toBeTruthy();

      cache.remove('test');
      expect(cache.get('test')).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', () => {
      cache.set('test1', { data: 1 }, 60000);
      cache.set('test2', { data: 2 }, 60000);
      cache.set('test3', { data: 3 }, 60000);

      cache.clear();

      expect(cache.get('test1')).toBeNull();
      expect(cache.get('test2')).toBeNull();
      expect(cache.get('test3')).toBeNull();
    });

    it('should preserve non-cache localStorage entries', () => {
      localStorage.setItem('other_key', 'other_value');
      cache.set('test', { data: 'value' }, 60000);

      cache.clear();

      expect(localStorage.getItem('other_key')).toBe('other_value');
      expect(cache.get('test')).toBeNull();
    });
  });

  describe('getSize', () => {
    it('should return number of cache entries', () => {
      const size1 = cache.getSize();
      expect(size1).toBe(0);

      cache.set('test1', { data: 1 }, 60000);
      expect(cache.getSize()).toBe(1);

      cache.set('test2', { data: 2 }, 60000);
      expect(cache.getSize()).toBe(2);

      cache.remove('test1');
      expect(cache.getSize()).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should handle localStorage errors gracefully', () => {
      const spy = vi.spyOn(console, 'warn');
      vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });

      cache.set('test', { data: 'value' }, 60000);
      expect(spy).toHaveBeenCalled();

      vi.restoreAllMocks();
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  success,
  error,
  getOrThrow,
  getOrDefault,
  chain,
  validateAll,
  asyncSuccess,
  asyncError,
  PaginationHelper,
  TypeCache,
} from './type-helpers';
import type { Result } from './type-helpers';

describe('Result type helpers', () => {
  describe('success and error', () => {
    it('creates success results', () => {
      const result = success(42);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42);
      }
    });

    it('creates error results', () => {
      const result = error('Not found');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Not found');
      }
    });
  });

  describe('getOrThrow', () => {
    it('returns data from success result', () => {
      const result = success(100);
      expect(getOrThrow(result)).toBe(100);
    });

    it('throws error from error result', () => {
      const result = error('Failed');
      expect(() => getOrThrow(result)).toThrow('Failed');
    });
  });

  describe('getOrDefault', () => {
    it('returns data from success result', () => {
      const result = success(50);
      expect(getOrDefault(result, 0)).toBe(50);
    });

    it('returns default from error result', () => {
      const result = error('Failed');
      expect(getOrDefault(result, 0)).toBe(0);
    });
  });

  describe('chain', () => {
    it('chains operations on success', () => {
      const result1 = success(10);
      const chained = chain(result1, (data) => success(data * 2));
      expect(getOrThrow(chained)).toBe(20);
    });

    it('short-circuits on error', () => {
      const result1 = error('Failed');
      const chained = chain(result1, (data) => success((data as number) * 2));
      expect(chained.success).toBe(false);
    });
  });

  describe('validateAll', () => {
    it('succeeds when all items pass predicate', () => {
      const items = [1, 2, 3, 4];
      const result = validateAll(items, (n) => n > 0, 'All must be positive');
      expect(result.success).toBe(true);
    });

    it('fails when any item fails predicate', () => {
      const items = [1, -2, 3];
      const result = validateAll(items, (n) => n > 0, 'All must be positive');
      expect(result.success).toBe(false);
    });
  });

  describe('async result helpers', () => {
    it('creates async success promises', async () => {
      const result = await asyncSuccess(42);
      expect(result.success).toBe(true);
    });

    it('creates async error promises', async () => {
      const result = await asyncError('Failed');
      expect(result.success).toBe(false);
    });
  });
});

describe('PaginationHelper', () => {
  const helper = new PaginationHelper(100, 10);

  describe('page calculation', () => {
    it('calculates total pages correctly', () => {
      expect(helper.getTotalPages()).toBe(10);
    });

    it('limits page to valid range', () => {
      expect(helper.getCurrentPage(0)).toBe(1);
      expect(helper.getCurrentPage(999)).toBe(10);
    });

    it('calculates offset correctly', () => {
      expect(helper.getOffset(1)).toBe(0);
      expect(helper.getOffset(2)).toBe(10);
      expect(helper.getOffset(3)).toBe(20);
    });
  });

  describe('range calculation', () => {
    it('calculates range for page', () => {
      expect(helper.getRange(1)).toEqual([0, 9]);
      expect(helper.getRange(2)).toEqual([10, 19]);
    });
  });

  describe('validation', () => {
    it('validates page numbers', () => {
      expect(helper.isValidPage(1)).toBe(true);
      expect(helper.isValidPage(10)).toBe(true);
      expect(helper.isValidPage(11)).toBe(false);
      expect(helper.isValidPage(0)).toBe(false);
    });
  });
});

describe('TypeCache', () => {
  it('caches computed values', () => {
    const cache = new TypeCache<string, number>();
    let computeCount = 0;

    const compute = () => {
      computeCount++;
      return 42;
    };

    expect(cache.get('key1', compute)).toBe(42);
    expect(computeCount).toBe(1);

    expect(cache.get('key1', compute)).toBe(42);
    expect(computeCount).toBe(1); // Not recomputed
  });

  it('handles multiple keys', () => {
    const cache = new TypeCache<string, number>();
    cache.get('a', () => 1);
    cache.get('b', () => 2);

    expect(cache.has('a')).toBe(true);
    expect(cache.has('b')).toBe(true);
    expect(cache.has('c')).toBe(false);
  });

  it('can clear cache', () => {
    const cache = new TypeCache<string, number>();
    cache.get('key', () => 42);
    cache.clear();
    expect(cache.has('key')).toBe(false);
  });

  it('can delete individual entries', () => {
    const cache = new TypeCache<string, number>();
    cache.get('key', () => 42);
    cache.delete('key');
    expect(cache.has('key')).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import {
  isValidBlockHeight,
  validateBlockHeight,
  assertBlockHeight,
  getBlockHeightAge,
  getBlockHeightDaysOld,
  isBlockHeightRecent,
  compareBlockHeights,
  sortBlockHeightsByNewest,
  sortBlockHeightsByOldest,
} from './block-height-utils';

describe('block height validation utilities', () => {
  describe('isValidBlockHeight', () => {
    it('should validate positive numbers', () => {
      expect(isValidBlockHeight(0)).toBe(true);
      expect(isValidBlockHeight(1)).toBe(true);
      expect(isValidBlockHeight(100000)).toBe(true);
    });

    it('should reject negative numbers', () => {
      expect(isValidBlockHeight(-1)).toBe(false);
    });

    it('should reject non-numbers', () => {
      expect(isValidBlockHeight(null)).toBe(false);
      expect(isValidBlockHeight(undefined)).toBe(false);
      expect(isValidBlockHeight('123')).toBe(false);
      expect(isValidBlockHeight({ value: 123 })).toBe(false);
    });

    it('should reject Infinity and NaN', () => {
      expect(isValidBlockHeight(Infinity)).toBe(false);
      expect(isValidBlockHeight(-Infinity)).toBe(false);
      expect(isValidBlockHeight(NaN)).toBe(false);
    });
  });

  describe('validateBlockHeight', () => {
    it('should return valid block height', () => {
      expect(validateBlockHeight(100)).toBe(100);
    });

    it('should throw on invalid input', () => {
      expect(() => validateBlockHeight(-1)).toThrow();
      expect(() => validateBlockHeight(null)).toThrow();
      expect(() => validateBlockHeight('invalid')).toThrow();
    });

    it('should use custom field name in error', () => {
      expect(() => validateBlockHeight(-1, 'createdAt')).toThrow('createdAt');
    });
  });

  describe('assertBlockHeight', () => {
    it('should pass for valid block height', () => {
      const value: unknown = 100;
      assertBlockHeight(value);
      expect(value).toBe(100);
    });

    it('should throw on invalid input', () => {
      expect(() => assertBlockHeight(-1)).toThrow();
      expect(() => assertBlockHeight(null)).toThrow();
    });

    it('should use custom error message', () => {
      expect(() => assertBlockHeight(null, 'Custom error')).toThrow('Custom error');
    });
  });

  describe('getBlockHeightAge', () => {
    it('should calculate age in milliseconds', () => {
      const age = getBlockHeightAge(100000);
      expect(age).toBeGreaterThan(0);
    });

    it('should return null for invalid inputs', () => {
      expect(getBlockHeightAge(null)).toBeNull();
      expect(getBlockHeightAge(undefined)).toBeNull();
      expect(getBlockHeightAge(NaN)).toBeNull();
    });
  });

  describe('getBlockHeightDaysOld', () => {
    it('should calculate age in days', () => {
      const daysOld = getBlockHeightDaysOld(100000);
      expect(daysOld).toBeGreaterThan(0);
      expect(typeof daysOld).toBe('number');
    });

    it('should return null for invalid inputs', () => {
      expect(getBlockHeightDaysOld(null)).toBeNull();
      expect(getBlockHeightDaysOld(undefined)).toBeNull();
    });
  });

  describe('isBlockHeightRecent', () => {
    it('should identify recent block heights', () => {
      const recentBlockHeight = 10000000;
      const isRecent = isBlockHeightRecent(recentBlockHeight, 365 * 24 * 60 * 60 * 1000);
      expect(typeof isRecent).toBe('boolean');
    });

    it('should return false for invalid inputs', () => {
      expect(isBlockHeightRecent(null)).toBe(false);
      expect(isBlockHeightRecent(undefined)).toBe(false);
    });

    it('should respect custom time window', () => {
      const oldBlockHeight = 1000;
      const isRecentOneHour = isBlockHeightRecent(oldBlockHeight, 60 * 60 * 1000);
      expect(isRecentOneHour).toBe(false);
    });
  });

  describe('compareBlockHeights', () => {
    it('should compare block heights correctly', () => {
      expect(compareBlockHeights(100, 50)).toBeGreaterThan(0);
      expect(compareBlockHeights(50, 100)).toBeLessThan(0);
      expect(compareBlockHeights(100, 100)).toBe(0);
    });

    it('should handle null and undefined', () => {
      expect(compareBlockHeights(null, 100)).toBeLessThan(0);
      expect(compareBlockHeights(100, null)).toBeGreaterThan(0);
      expect(compareBlockHeights(undefined, undefined)).toBe(0);
    });
  });

  describe('sortBlockHeightsByNewest', () => {
    it('should sort block heights in descending order', () => {
      const heights = [100, 50, 200, 75];
      const sorted = sortBlockHeightsByNewest(heights);
      expect(sorted).toEqual([200, 100, 75, 50]);
    });

    it('should not mutate original array', () => {
      const heights = [100, 50];
      const original = [...heights];
      sortBlockHeightsByNewest(heights);
      expect(heights).toEqual(original);
    });

    it('should handle null and undefined', () => {
      const heights: (number | null | undefined)[] = [100, null, 50, undefined];
      const sorted = sortBlockHeightsByNewest(heights);
      expect(sorted[0]).toBe(100);
      expect(sorted[1]).toBe(50);
    });
  });

  describe('sortBlockHeightsByOldest', () => {
    it('should sort block heights in ascending order', () => {
      const heights = [100, 50, 200, 75];
      const sorted = sortBlockHeightsByOldest(heights);
      expect(sorted).toEqual([50, 75, 100, 200]);
    });

    it('should not mutate original array', () => {
      const heights = [100, 50];
      const original = [...heights];
      sortBlockHeightsByOldest(heights);
      expect(heights).toEqual(original);
    });
  });
});

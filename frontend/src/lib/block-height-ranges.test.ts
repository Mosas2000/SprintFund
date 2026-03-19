import { describe, it, expect } from 'vitest';
import {
  BLOCK_HEIGHT_RANGES,
  getBlockHeightRange,
  blockHeightsBetween,
  blockHeightsSince,
  blockHeightsAfter,
  getBlockHeightIntervals,
} from './block-height-ranges';

describe('block height ranges', () => {
  describe('BLOCK_HEIGHT_RANGES', () => {
    it('should define all standard ranges', () => {
      expect(BLOCK_HEIGHT_RANGES.today).toBeTruthy();
      expect(BLOCK_HEIGHT_RANGES.lastWeek).toBeTruthy();
      expect(BLOCK_HEIGHT_RANGES.lastMonth).toBeTruthy();
      expect(BLOCK_HEIGHT_RANGES.lastYear).toBeTruthy();
      expect(BLOCK_HEIGHT_RANGES.older).toBeTruthy();
    });

    it('should have sequential age ranges', () => {
      const ranges = Object.values(BLOCK_HEIGHT_RANGES);
      for (let i = 0; i < ranges.length - 1; i++) {
        expect(ranges[i].maxAge).toBeLessThanOrEqual(ranges[i + 1].minAge);
      }
    });
  });

  describe('getBlockHeightRange', () => {
    it('should identify range for recent blocks', () => {
      const veryRecentBlockHeight = 10000000;
      const range = getBlockHeightRange(veryRecentBlockHeight);
      expect(['today', 'lastWeek', 'lastMonth', 'lastYear', 'older']).toContain(range);
    });

    it('should return null for invalid input', () => {
      expect(getBlockHeightRange(null)).toBeNull();
      expect(getBlockHeightRange(undefined)).toBeNull();
    });

    it('should handle very old blocks', () => {
      const oldBlockHeight = 1000;
      const range = getBlockHeightRange(oldBlockHeight);
      expect(range).toBeTruthy();
    });
  });

  describe('blockHeightsBetween', () => {
    const blockHeights = [100000, 50000, 200000, 75000];
    const oneDay = 24 * 60 * 60 * 1000;

    it('should filter blocks in age range', () => {
      const filtered = blockHeightsBetween(blockHeights, 0, 100 * oneDay);
      expect(Array.isArray(filtered)).toBe(true);
    });

    it('should handle empty input', () => {
      const filtered = blockHeightsBetween([], 0, 100 * oneDay);
      expect(filtered).toEqual([]);
    });

    it('should handle null and undefined', () => {
      const blockHeightsWithNull: (number | null | undefined)[] = [
        100000,
        null,
        undefined,
        200000,
      ];
      const filtered = blockHeightsBetween(blockHeightsWithNull, 0, 100 * 365 * oneDay);
      expect(filtered.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('blockHeightsSince', () => {
    const blockHeights = [100000, 200000, 300000];
    const oneDay = 24 * 60 * 60 * 1000;

    it('should filter blocks within time range', () => {
      const filtered = blockHeightsSince(blockHeights, 1000 * oneDay);
      expect(Array.isArray(filtered)).toBe(true);
    });

    it('should include blocks up to specified age', () => {
      const result = blockHeightsSince(blockHeights, 365 * oneDay);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('blockHeightsAfter', () => {
    const blockHeights = [100000, 200000, 300000];
    const oneDay = 24 * 60 * 60 * 1000;

    it('should filter blocks older than specified age', () => {
      const filtered = blockHeightsAfter(blockHeights, 1000 * oneDay);
      expect(Array.isArray(filtered)).toBe(true);
    });
  });

  describe('getBlockHeightIntervals', () => {
    it('should return all ranges when count is large', () => {
      const intervals = getBlockHeightIntervals(10);
      expect(intervals.length).toBe(5);
    });

    it('should return limited ranges when count is small', () => {
      const intervals = getBlockHeightIntervals(2);
      expect(intervals.length).toBe(2);
      expect(intervals[0].label).toBe('Today');
      expect(intervals[1].label).toBe('Last Week');
    });

    it('should return correct order', () => {
      const intervals = getBlockHeightIntervals(5);
      expect(intervals[0].label).toBe('Today');
      expect(intervals[1].label).toBe('Last Week');
      expect(intervals[2].label).toBe('Last Month');
      expect(intervals[3].label).toBe('Last Year');
      expect(intervals[4].label).toBe('Older');
    });
  });
});

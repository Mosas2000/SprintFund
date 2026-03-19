import { describe, it, expect } from 'vitest';
import { formatBlockHeight, formatBlockHeightShort, getBlockTimestampEstimate } from './block-height';

describe('block-height utilities', () => {
  describe('formatBlockHeightShort', () => {
    it('should format positive block heights', () => {
      expect(formatBlockHeightShort(12345)).toContain('Block #12,345');
    });

    it('should handle zero', () => {
      expect(formatBlockHeightShort(0)).toContain('Block #0');
    });

    it('should handle null', () => {
      expect(formatBlockHeightShort(null)).toBe('Block #0');
    });

    it('should handle undefined', () => {
      expect(formatBlockHeightShort(undefined)).toBe('Block #0');
    });

    it('should handle NaN', () => {
      expect(formatBlockHeightShort(NaN)).toBe('Block #0');
    });

    it('should handle negative numbers', () => {
      expect(formatBlockHeightShort(-5)).toBe('Block #0');
    });

    it('should format large numbers with commas', () => {
      expect(formatBlockHeightShort(1000000)).toContain('Block #1,000,000');
    });
  });

  describe('formatBlockHeight', () => {
    it('should format block height with relative time', () => {
      const result = formatBlockHeight(12345);
      expect(result).toMatch(/Block #\d+,?\d* \(.+ ago\)/);
    });

    it('should handle zero', () => {
      const result = formatBlockHeight(0);
      expect(result).toMatch(/Block #0 \(.+\)/);
    });

    it('should handle null', () => {
      expect(formatBlockHeight(null)).toBe('Block #0');
    });

    it('should handle undefined', () => {
      expect(formatBlockHeight(undefined)).toBe('Block #0');
    });

    it('should handle NaN', () => {
      expect(formatBlockHeight(NaN)).toBe('Block #0');
    });

    it('should handle negative numbers', () => {
      expect(formatBlockHeight(-10)).toBe('Block #0');
    });
  });

  describe('getBlockTimestampEstimate', () => {
    it('should estimate timestamp from block height', () => {
      const blockHeight = 1000;
      const timestamp = getBlockTimestampEstimate(blockHeight);
      expect(timestamp).not.toBeNull();
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
    });

    it('should return null for invalid inputs', () => {
      expect(getBlockTimestampEstimate(null)).toBeNull();
      expect(getBlockTimestampEstimate(undefined)).toBeNull();
      expect(getBlockTimestampEstimate(NaN)).toBeNull();
      expect(getBlockTimestampEstimate(-5)).toBeNull();
    });

    it('should estimate reasonable timestamps', () => {
      const blockHeight = 100;
      const timestamp = getBlockTimestampEstimate(blockHeight);
      if (timestamp) {
        const now = Date.now();
        expect(timestamp).toBeLessThanOrEqual(now);
      }
    });
  });
});

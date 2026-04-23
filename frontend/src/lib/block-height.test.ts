import { describe, it, expect } from 'vitest';
import { 
  getBlockTimestampEstimate, 
  getBlockHeightCountdown,
  formatBlockHeight,
  formatBlockHeightShort
} from './block-height';

describe('block-height utilities', () => {
  describe('getBlockTimestampEstimate', () => {
    it('returns null for invalid inputs', () => {
      expect(getBlockTimestampEstimate(null)).toBeNull();
      expect(getBlockTimestampEstimate(undefined)).toBeNull();
      expect(getBlockTimestampEstimate(-1)).toBeNull();
      expect(getBlockTimestampEstimate(NaN)).toBeNull();
    });

    it('estimates timestamp from block height', () => {
      const timestamp = getBlockTimestampEstimate(100000);
      expect(timestamp).toBeGreaterThan(0);
      expect(typeof timestamp).toBe('number');
    });
  });

  describe('getBlockHeightCountdown', () => {
    it('calculates countdown correctly when target is in future', () => {
      const countdown = getBlockHeightCountdown(100500, 100400);
      expect(countdown.blocksRemaining).toBe(100);
      expect(countdown.isPassed).toBe(false);
      expect(countdown.estimatedTimestamp).toBeGreaterThan(0);
    });

    it('handles target in the past', () => {
      const countdown = getBlockHeightCountdown(100300, 100400);
      expect(countdown.blocksRemaining).toBe(0);
      expect(countdown.isPassed).toBe(true);
    });

    it('handles exact target', () => {
      const countdown = getBlockHeightCountdown(100400, 100400);
      expect(countdown.blocksRemaining).toBe(0);
      expect(countdown.isPassed).toBe(true);
    });
  });

  describe('formatBlockHeight', () => {
    it('formats valid block height with relative time', () => {
      const formatted = formatBlockHeight(100000);
      expect(formatted).toMatch(/Block #100,000/);
    });

    it('handles invalid inputs by returning Block #0', () => {
      expect(formatBlockHeight(null)).toBe('Block #0');
      expect(formatBlockHeight(-1)).toBe('Block #0');
    });
  });

  describe('formatBlockHeightShort', () => {
    it('formats block height without time', () => {
      expect(formatBlockHeightShort(123456)).toBe('Block #123,456');
    });

    it('handles invalid inputs', () => {
      expect(formatBlockHeightShort(null)).toBe('Block #0');
    });
  });
});

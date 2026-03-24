import { describe, it, expect } from 'vitest';
import {
  formatUsd,
  formatUsdCompact,
  formatPercentage,
  stxToUsd,
  usdToStx,
} from './currency';

describe('currency utilities', () => {
  describe('formatUsd', () => {
    it('formats positive amounts', () => {
      expect(formatUsd(123.45)).toBe('$123.45');
    });

    it('formats zero', () => {
      expect(formatUsd(0)).toBe('$0.00');
    });

    it('formats large amounts with commas', () => {
      expect(formatUsd(1234567.89)).toBe('$1,234,567.89');
    });

    it('rounds to two decimal places', () => {
      expect(formatUsd(1.999)).toBe('$2.00');
    });
  });

  describe('formatUsdCompact', () => {
    it('formats small amounts normally', () => {
      expect(formatUsdCompact(123.45)).toBe('$123.45');
    });

    it('formats thousands with K suffix', () => {
      expect(formatUsdCompact(1500)).toBe('$1.50K');
    });

    it('formats millions with M suffix', () => {
      expect(formatUsdCompact(2500000)).toBe('$2.50M');
    });

    it('handles edge case at exactly 1000', () => {
      expect(formatUsdCompact(1000)).toBe('$1.00K');
    });
  });

  describe('formatPercentage', () => {
    it('formats positive percentages with plus sign', () => {
      expect(formatPercentage(2.5)).toBe('+2.50%');
    });

    it('formats negative percentages', () => {
      expect(formatPercentage(-1.25)).toBe('-1.25%');
    });

    it('formats zero', () => {
      expect(formatPercentage(0)).toBe('+0.00%');
    });
  });

  describe('stxToUsd', () => {
    it('converts STX to USD', () => {
      expect(stxToUsd(100, 1.5)).toBe(150);
    });

    it('handles zero amount', () => {
      expect(stxToUsd(0, 1.5)).toBe(0);
    });

    it('handles fractional amounts', () => {
      expect(stxToUsd(0.5, 2)).toBe(1);
    });
  });

  describe('usdToStx', () => {
    it('converts USD to STX', () => {
      expect(usdToStx(150, 1.5)).toBe(100);
    });

    it('handles zero price', () => {
      expect(usdToStx(100, 0)).toBe(0);
    });

    it('handles negative price', () => {
      expect(usdToStx(100, -1)).toBe(0);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { microToStx, stxToMicro, formatStx } from '../../config';

describe('STX conversion round-trip', () => {
  it('micro -> stx -> micro is identity for whole STX values', () => {
    for (const stx of [1, 5, 10, 100, 1000]) {
      const micro = stx * 1_000_000;
      expect(stxToMicro(microToStx(micro))).toBe(micro);
    }
  });

  it('stx -> micro -> stx is identity for whole STX values', () => {
    for (const stx of [1, 5, 10, 100]) {
      expect(microToStx(stxToMicro(stx))).toBe(stx);
    }
  });

  it('handles the minimum stake amount correctly', () => {
    const minMicro = 10_000_000;
    expect(microToStx(minMicro)).toBe(10);
    expect(stxToMicro(10)).toBe(minMicro);
  });
});

describe('formatStx edge cases', () => {
  it('formats negative micro amounts', () => {
    const result = formatStx(-1_000_000);
    expect(result).toContain('-1');
  });

  it('formats very large micro amounts', () => {
    const result = formatStx(1_000_000_000_000);
    expect(result.replace(/,/g, '')).toContain('1000000');
  });

  it('formats with zero decimal places', () => {
    const result = formatStx(5_500_000, 0);
    expect(result).not.toContain('.');
  });

  it('formats with six decimal places', () => {
    const result = formatStx(1_234_567, 6);
    expect(result).toContain('1.234567');
  });
});

describe('microToStx precision', () => {
  it('1 micro = 0.000001 STX', () => {
    expect(microToStx(1)).toBeCloseTo(0.000001, 6);
  });

  it('999999 micro < 1 STX', () => {
    expect(microToStx(999_999)).toBeLessThan(1);
  });

  it('1000001 micro > 1 STX', () => {
    expect(microToStx(1_000_001)).toBeGreaterThan(1);
  });
});

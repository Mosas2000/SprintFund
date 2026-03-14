import { describe, it, expect } from 'vitest';
import {
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  CONTRACT_PRINCIPAL,
  NETWORK,
  API_URL,
  EXPLORER_URL,
  microToStx,
  stxToMicro,
  formatStx,
  SITE,
  MIN_STAKE_STX,
  MIN_STAKE_MICRO,
} from '../../config';

describe('contract constants', () => {
  it('CONTRACT_ADDRESS is a valid Stacks principal', () => {
    expect(CONTRACT_ADDRESS).toMatch(/^SP[A-Z0-9]+$/);
  });

  it('CONTRACT_NAME is non-empty', () => {
    expect(CONTRACT_NAME.length).toBeGreaterThan(0);
  });

  it('CONTRACT_PRINCIPAL combines address and name', () => {
    expect(CONTRACT_PRINCIPAL).toBe(`${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
  });

  it('NETWORK is mainnet', () => {
    expect(NETWORK).toBe('mainnet');
  });
});

describe('API constants', () => {
  it('API_URL points to Hiro mainnet', () => {
    expect(API_URL).toContain('mainnet');
    expect(API_URL).toContain('hiro.so');
  });

  it('EXPLORER_URL points to Hiro explorer', () => {
    expect(EXPLORER_URL).toContain('explorer');
    expect(EXPLORER_URL).toContain('hiro.so');
  });

  it('API_URL uses HTTPS', () => {
    expect(API_URL).toMatch(/^https:\/\//);
  });

  it('EXPLORER_URL uses HTTPS', () => {
    expect(EXPLORER_URL).toMatch(/^https:\/\//);
  });
});

describe('microToStx', () => {
  it('converts 1_000_000 micro to 1 STX', () => {
    expect(microToStx(1_000_000)).toBe(1);
  });

  it('converts 0 micro to 0 STX', () => {
    expect(microToStx(0)).toBe(0);
  });

  it('converts 500_000 micro to 0.5 STX', () => {
    expect(microToStx(500_000)).toBe(0.5);
  });

  it('handles large values', () => {
    expect(microToStx(100_000_000)).toBe(100);
  });

  it('handles fractional micro amounts', () => {
    expect(microToStx(1)).toBe(0.000001);
  });
});

describe('stxToMicro', () => {
  it('converts 1 STX to 1_000_000 micro', () => {
    expect(stxToMicro(1)).toBe(1_000_000);
  });

  it('converts 0 STX to 0 micro', () => {
    expect(stxToMicro(0)).toBe(0);
  });

  it('floors fractional micro results', () => {
    expect(stxToMicro(0.0000001)).toBe(0);
  });

  it('handles decimal STX values', () => {
    expect(stxToMicro(1.5)).toBe(1_500_000);
  });

  it('is the inverse of microToStx for whole numbers', () => {
    expect(microToStx(stxToMicro(42))).toBe(42);
  });
});

describe('formatStx', () => {
  it('formats micro amount as STX with 2 decimal places by default', () => {
    const result = formatStx(5_000_000);
    expect(result).toContain('5');
    expect(result).toContain('.');
  });

  it('formats 0 as 0.00', () => {
    expect(formatStx(0)).toBe('0.00');
  });

  it('respects custom decimal places', () => {
    const result = formatStx(1_234_567, 4);
    expect(result).toContain('1.2346');
  });

  it('adds locale-appropriate thousands separator for large amounts', () => {
    const result = formatStx(1_000_000_000);
    expect(result.replace(/,/g, '')).toContain('1000');
  });
});

describe('SITE metadata', () => {
  it('has a name', () => {
    expect(SITE.name).toBe('SprintFund');
  });

  it('has a tagline', () => {
    expect(SITE.tagline.length).toBeGreaterThan(0);
  });

  it('has a description', () => {
    expect(SITE.description.length).toBeGreaterThan(0);
  });
});

describe('MIN_STAKE constants', () => {
  it('MIN_STAKE_STX is 10', () => {
    expect(MIN_STAKE_STX).toBe(10);
  });

  it('MIN_STAKE_MICRO equals MIN_STAKE_STX * 1_000_000', () => {
    expect(MIN_STAKE_MICRO).toBe(MIN_STAKE_STX * 1_000_000);
  });

  it('MIN_STAKE_MICRO is 10_000_000', () => {
    expect(MIN_STAKE_MICRO).toBe(10_000_000);
  });
});

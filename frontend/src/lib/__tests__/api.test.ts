import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import {
  getStxBalance,
  getTxStatus,
  explorerTxUrl,
  explorerAddressUrl,
  truncateAddress,
} from '../../lib/api';

const originalFetch = globalThis.fetch;

beforeEach(() => {
  vi.restoreAllMocks();
  globalThis.fetch = originalFetch;
});

describe('explorerTxUrl', () => {
  it('generates a valid explorer URL for a transaction', () => {
    const url = explorerTxUrl('0xabc123');
    expect(url).toContain('explorer.hiro.so');
    expect(url).toContain('0xabc123');
    expect(url).toContain('chain=mainnet');
  });

  it('encodes special characters in txId', () => {
    const url = explorerTxUrl('tx with spaces');
    expect(url).not.toContain(' ');
  });
});

describe('explorerAddressUrl', () => {
  it('generates a valid explorer URL for an address', () => {
    const url = explorerAddressUrl('SP1EXAMPLE');
    expect(url).toContain('explorer.hiro.so');
    expect(url).toContain('SP1EXAMPLE');
    expect(url).toContain('chain=mainnet');
  });

  it('includes the address path segment', () => {
    const url = explorerAddressUrl('SP1TEST');
    expect(url).toContain('/address/');
  });
});

describe('truncateAddress', () => {
  it('truncates a long address', () => {
    const addr = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
    const truncated = truncateAddress(addr);
    expect(truncated).toContain('SP31PK');
    expect(truncated).toContain('2W5T');
    expect(truncated.length).toBeLessThan(addr.length);
  });

  it('returns short addresses unchanged', () => {
    const addr = 'SP1SHORT';
    expect(truncateAddress(addr)).toBe(addr);
  });

  it('returns address of 12 characters or less unchanged', () => {
    const addr = 'SP1ABCDEFGH';
    expect(truncateAddress(addr)).toBe(addr);
  });

  it('uses ellipsis character in truncated form', () => {
    const addr = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
    const truncated = truncateAddress(addr);
    expect(truncated).toContain('…');
  });

  it('preserves first 6 characters', () => {
    const addr = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
    const truncated = truncateAddress(addr);
    expect(truncated.startsWith('SP31PK')).toBe(true);
  });

  it('preserves last 4 characters', () => {
    const addr = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
    const truncated = truncateAddress(addr);
    expect(truncated.endsWith('2W5T')).toBe(true);
  });
});

describe('getStxBalance', () => {
  it('returns balance from API response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ balance: 5000000 }),
    });

    const balance = await getStxBalance('SP1EXAMPLE');
    expect(balance).toBe(5000000);
  });

  it('returns 0 when API returns non-ok response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    const balance = await getStxBalance('SP1EXAMPLE');
    expect(balance).toBe(0);
  });

  it('returns 0 when balance field is missing', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const balance = await getStxBalance('SP1EXAMPLE');
    expect(balance).toBe(0);
  });

  it('calls the correct Hiro API endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ balance: 0 }),
    });
    globalThis.fetch = mockFetch;

    await getStxBalance('SP1ADDR');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/extended/v1/address/'),
    );
  });
});

describe('getTxStatus', () => {
  it('returns transaction status from API', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ tx_status: 'success' }),
    });

    const status = await getTxStatus('0xabc');
    expect(status).toBe('success');
  });

  it('returns unknown when API returns non-ok response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    const status = await getTxStatus('0xabc');
    expect(status).toBe('unknown');
  });

  it('returns unknown when tx_status field is missing', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const status = await getTxStatus('0xabc');
    expect(status).toBe('unknown');
  });

  it('calls the correct Hiro API endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ tx_status: 'pending' }),
    });
    globalThis.fetch = mockFetch;

    await getTxStatus('0xdef');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/extended/v1/tx/'),
    );
  });
});

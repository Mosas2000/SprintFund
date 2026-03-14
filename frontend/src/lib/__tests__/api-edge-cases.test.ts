import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { getStxBalance, getTxStatus, explorerTxUrl, explorerAddressUrl } from '../../lib/api';

const originalFetch = globalThis.fetch;

afterEach(() => {
  vi.restoreAllMocks();
  globalThis.fetch = originalFetch;
});

import { afterEach } from 'vitest';

describe('getStxBalance error handling', () => {
  it('returns 0 when fetch throws network error', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));
    const balance = await getStxBalance('SP1ADDR');
    expect(balance).toBe(0);
  });

  it('returns 0 when response JSON is malformed', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new SyntaxError('Unexpected token')),
    });
    const balance = await getStxBalance('SP1ADDR');
    expect(balance).toBe(0);
  });

  it('returns 0 for 404 response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });
    const balance = await getStxBalance('SP1NONEXIST');
    expect(balance).toBe(0);
  });

  it('returns 0 for 500 response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    const balance = await getStxBalance('SP1ADDR');
    expect(balance).toBe(0);
  });
});

describe('getTxStatus edge cases', () => {
  it('returns pending for mempool transactions', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ tx_status: 'pending' }),
    });
    const status = await getTxStatus('0xpending');
    expect(status).toBe('pending');
  });

  it('returns abort_by_response for aborted transactions', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ tx_status: 'abort_by_response' }),
    });
    const status = await getTxStatus('0xaborted');
    expect(status).toBe('abort_by_response');
  });

  it('returns unknown when fetch throws', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('timeout'));
    const status = await getTxStatus('0xfail');
    expect(status).toBe('unknown');
  });
});

describe('explorer URL formatting', () => {
  it('tx URL includes /txid/ path segment', () => {
    const url = explorerTxUrl('0x123');
    expect(url).toContain('/txid/');
  });

  it('address URL includes /address/ path segment', () => {
    const url = explorerAddressUrl('SP1TEST');
    expect(url).toContain('/address/');
  });

  it('both URLs include chain=mainnet parameter', () => {
    expect(explorerTxUrl('0x1')).toContain('chain=mainnet');
    expect(explorerAddressUrl('SP1')).toContain('chain=mainnet');
  });
});

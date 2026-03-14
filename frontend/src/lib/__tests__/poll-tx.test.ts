import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { pollTxStatus } from '../../lib/poll-tx';

describe('pollTxStatus export', () => {
  it('is a function', () => {
    expect(typeof pollTxStatus).toBe('function');
  });

  it('returns a promise', () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ tx_status: 'success' }),
    });
    globalThis.fetch = mockFetch;

    const result = pollTxStatus('0xabc');
    expect(result).toBeInstanceOf(Promise);
  });
});

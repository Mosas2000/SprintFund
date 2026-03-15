import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { useNetworkStatus } from '../useNetworkStatus';

describe('useNetworkStatus hook', () => {
  it('is exported as a function', () => {
    expect(typeof useNetworkStatus).toBe('function');
  });
});

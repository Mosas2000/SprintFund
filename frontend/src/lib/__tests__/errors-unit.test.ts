import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { ERROR_MESSAGES, toErrorMessage } from '../../lib/errors';

describe('ERROR_MESSAGES', () => {
  it('has a network error message', () => {
    expect(ERROR_MESSAGES.NETWORK).toBeDefined();
    expect(typeof ERROR_MESSAGES.NETWORK).toBe('string');
  });

  it('has a generic error message', () => {
    expect(ERROR_MESSAGES.GENERIC).toBeDefined();
    expect(typeof ERROR_MESSAGES.GENERIC).toBe('string');
  });

  it('messages are non-empty strings', () => {
    Object.values(ERROR_MESSAGES).forEach(msg => {
      expect(msg.length).toBeGreaterThan(0);
    });
  });
});

describe('toErrorMessage', () => {
  it('extracts message from Error object', () => {
    const err = new Error('something went wrong');
    const msg = toErrorMessage(err);
    expect(msg).toContain('something went wrong');
  });

  it('converts string error to message', () => {
    const msg = toErrorMessage('string error');
    expect(msg).toContain('string error');
  });

  it('handles null error', () => {
    const msg = toErrorMessage(null);
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });

  it('handles undefined error', () => {
    const msg = toErrorMessage(undefined);
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });

  it('handles number error', () => {
    const msg = toErrorMessage(42);
    expect(typeof msg).toBe('string');
  });

  it('handles object with message property', () => {
    const err = { message: 'custom error object' };
    const msg = toErrorMessage(err);
    expect(typeof msg).toBe('string');
  });
});

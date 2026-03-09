import { describe, it, expect } from 'vitest';
import { ERROR_MESSAGES, toErrorMessage } from './errors';

describe('ERROR_MESSAGES', () => {
  it('contains all expected keys', () => {
    const keys = Object.keys(ERROR_MESSAGES);
    expect(keys).toContain('NETWORK');
    expect(keys).toContain('PROPOSALS_LOAD');
    expect(keys).toContain('PROPOSAL_NOT_FOUND');
    expect(keys).toContain('PROPOSAL_LOAD');
    expect(keys).toContain('DASHBOARD_LOAD');
    expect(keys).toContain('UNKNOWN');
  });

  it('every message is a non-empty string', () => {
    for (const msg of Object.values(ERROR_MESSAGES)) {
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0);
    }
  });
});

describe('toErrorMessage', () => {
  it('extracts message from Error instances', () => {
    const err = new Error('Something broke');
    expect(toErrorMessage(err)).toBe('Something broke');
  });

  it('returns string values as-is', () => {
    expect(toErrorMessage('custom error')).toBe('custom error');
  });

  it('returns UNKNOWN message for null', () => {
    expect(toErrorMessage(null)).toBe(ERROR_MESSAGES.UNKNOWN);
  });

  it('returns UNKNOWN message for undefined', () => {
    expect(toErrorMessage(undefined)).toBe(ERROR_MESSAGES.UNKNOWN);
  });

  it('returns UNKNOWN message for numeric values', () => {
    expect(toErrorMessage(42)).toBe(ERROR_MESSAGES.UNKNOWN);
  });

  it('returns UNKNOWN message for objects without message property', () => {
    expect(toErrorMessage({ code: 500 })).toBe(ERROR_MESSAGES.UNKNOWN);
  });
});

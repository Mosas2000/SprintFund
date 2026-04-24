import { describe, it, expect } from 'vitest';
import {
  getContractErrorByCode,
  getContractErrorByName,
  isKnownContractError,
  isRetryableContractError,
} from './contract-error-map';

describe('contract-error-map', () => {
  it('correctly identifies known error codes', () => {
    expect(isKnownContractError(100)).toBe(true);
    expect(isKnownContractError(115)).toBe(true);
    expect(isKnownContractError(999)).toBe(false);
  });

  it('correctly identifies retryable errors', () => {
    expect(isRetryableContractError(106)).toBe(true); // VOTING_PERIOD_ACTIVE
    expect(isRetryableContractError(114)).toBe(true); // STAKE_LOCKED
    expect(isRetryableContractError(100)).toBe(false); // NOT_AUTHORIZED
  });

  it('retrieves error entry by code', () => {
    const entry = getContractErrorByCode(100);
    expect(entry).not.toBeNull();
    expect(entry?.name).toBe('ERR-NOT-AUTHORIZED');
    expect(entry?.severity).toBe('high');
  });

  it('retrieves error entry by name', () => {
    const entry = getContractErrorByName('ERR-PROPOSAL-NOT-FOUND');
    expect(entry).not.toBeNull();
    expect(entry?.code).toBe(101);
  });

  it('returns null for unknown name', () => {
    expect(getContractErrorByName('ERR-NON-EXISTENT')).toBeNull();
  });
});

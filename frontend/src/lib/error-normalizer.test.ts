import { describe, it, expect } from 'vitest';
import { AsyncError, ErrorCode } from './async-errors';
import {
  normalizeError,
  extractContractCodeFromMessage,
  extractContractNameFromMessage,
} from './error-normalizer';

describe('error-normalizer', () => {
  describe('extractContractCodeFromMessage', () => {
    it('extracts code from Clarity error format', () => {
      expect(extractContractCodeFromMessage('execution failed: (err u100)')).toBe(100);
      expect(extractContractCodeFromMessage('Something went wrong (err u105)')).toBe(105);
    });

    it('extracts code from generic error message', () => {
      expect(extractContractCodeFromMessage('Contract error 102 occurred')).toBe(102);
      expect(extractContractCodeFromMessage('Error: 111')).toBe(111);
    });

    it('returns null when no code is found', () => {
      expect(extractContractCodeFromMessage('Something failed')).toBeNull();
    });
  });

  describe('extractContractNameFromMessage', () => {
    it('extracts name from Clarity error strings', () => {
      expect(extractContractNameFromMessage('Error: ERR-NOT-AUTHORIZED')).toBe('ERR-NOT-AUTHORIZED');
      expect(extractContractNameFromMessage('failed with ERR-INSUFFICIENT-STAKE')).toBe('ERR-INSUFFICIENT-STAKE');
    });

    it('returns null when no name is found', () => {
      expect(extractContractNameFromMessage('Something failed')).toBeNull();
    });
  });

  describe('normalizeError', () => {
    it('normalizes network errors', () => {
      const error = new AsyncError('failed to fetch', ErrorCode.NETWORK_ERROR);
      const normalized = normalizeError(error);
      expect(normalized.message).toBe('Unable to reach the network.');
      expect(normalized.retryable).toBe(true);
      expect(normalized.severity).toBe('medium');
    });

    it('normalizes contract errors by code', () => {
      const error = new AsyncError('execution failed: (err u100)', ErrorCode.CONTRACT_CALL_FAILED);
      const normalized = normalizeError(error);
      expect(normalized.message).toBe('You are not authorized to perform this action.');
      expect(normalized.contractCode).toBe(100);
      expect(normalized.severity).toBe('high');
    });

    it('normalizes contract errors by name', () => {
      const error = new AsyncError('failed: ERR-ALREADY-VOTED', ErrorCode.CONTRACT_CALL_FAILED);
      const normalized = normalizeError(error);
      expect(normalized.message).toBe('You have already voted on this proposal.');
      expect(normalized.contractCode).toBe(104);
    });

    it('handles unknown caught objects', () => {
      const normalized = normalizeError('Something broke');
      expect(normalized.message).toBe('Something broke');
      expect(normalized.rawCode).toBe('UNKNOWN');
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  CONTRACT_ERROR_CODES,
  isErrorWithMessage,
  getErrorMessage,
  isNetworkError,
} from './contract';
import type {
  ClarityWrappedValue,
  ClarityValue,
  RawProposal,
  RawStake,
  RawVote,
  ClarityOkResponse,
  ReadOnlyResult,
  TxFinishData,
  TxCallbacks,
  ContractCallOptions,
  ContractErrorCode,
  ContractErrorName,
  ContractError,
  NetworkError,
} from './contract';

describe('Contract types', () => {
  describe('ClarityWrappedValue', () => {
    it('wraps a string value', () => {
      const wrapped: ClarityWrappedValue<string> = { value: 'hello' };
      expect(wrapped.value).toBe('hello');
    });

    it('wraps a number value', () => {
      const wrapped: ClarityWrappedValue<number> = { value: 42 };
      expect(wrapped.value).toBe(42);
    });

    it('wraps a boolean value', () => {
      const wrapped: ClarityWrappedValue<boolean> = { value: true };
      expect(wrapped.value).toBe(true);
    });
  });

  describe('ClarityValue', () => {
    it('accepts an unwrapped value', () => {
      const val: ClarityValue<number> = 100;
      expect(val).toBe(100);
    });

    it('accepts a wrapped value', () => {
      const val: ClarityValue<number> = { value: 100 };
      expect((val as ClarityWrappedValue<number>).value).toBe(100);
    });
  });

  describe('RawProposal', () => {
    it('has all required fields matching Clarity contract shape', () => {
      const raw: RawProposal = {
        proposer: { value: 'SP123' },
        amount: { value: 50000000 },
        title: { value: 'Test Proposal' },
        description: { value: 'A test' },
        'votes-for': { value: 10 },
        'votes-against': { value: 3 },
        executed: { value: false },
        'created-at': { value: 12345 },
      };

      expect(raw.proposer).toEqual({ value: 'SP123' });
      expect(raw.amount).toEqual({ value: 50000000 });
      expect(raw['votes-for']).toEqual({ value: 10 });
      expect(raw['votes-against']).toEqual({ value: 3 });
      expect(raw.executed).toEqual({ value: false });
      expect(raw['created-at']).toEqual({ value: 12345 });
    });

    it('accepts unwrapped field values', () => {
      const raw: RawProposal = {
        proposer: 'SP123',
        amount: 50000000,
        title: 'Test Proposal',
        description: 'A test',
        'votes-for': 10,
        'votes-against': 3,
        executed: false,
        'created-at': 12345,
      };

      expect(raw.proposer).toBe('SP123');
      expect(raw.amount).toBe(50000000);
    });
  });

  describe('RawStake', () => {
    it('represents a staked amount', () => {
      const stake: RawStake = { amount: { value: 10000000 } };
      expect(stake.amount).toEqual({ value: 10000000 });
    });
  });

  describe('RawVote', () => {
    it('represents a vote with weight and support', () => {
      const vote: RawVote = {
        weight: { value: 5 },
        support: { value: true },
      };
      expect(vote.weight).toEqual({ value: 5 });
      expect(vote.support).toEqual({ value: true });
    });
  });

  describe('ClarityOkResponse', () => {
    it('wraps a value in an ok response', () => {
      const response: ClarityOkResponse<number> = { value: 42 };
      expect(response.value).toBe(42);
    });
  });

  describe('ReadOnlyResult', () => {
    it('accepts a value', () => {
      const result: ReadOnlyResult<number> = 42;
      expect(result).toBe(42);
    });

    it('accepts null for missing data', () => {
      const result: ReadOnlyResult<number> = null;
      expect(result).toBeNull();
    });
  });

  describe('TxFinishData', () => {
    it('contains a transaction ID', () => {
      const data: TxFinishData = { txId: 'abc123' };
      expect(data.txId).toBe('abc123');
    });
  });

  describe('TxCallbacks', () => {
    it('defines onFinish and onCancel callbacks', () => {
      let finished = false;
      let cancelled = false;

      const callbacks: TxCallbacks = {
        onFinish: () => { finished = true; },
        onCancel: () => { cancelled = true; },
      };

      callbacks.onFinish('tx123');
      expect(finished).toBe(true);

      callbacks.onCancel();
      expect(cancelled).toBe(true);
    });
  });

  describe('ContractCallOptions', () => {
    it('groups function name, args, and callbacks', () => {
      const opts: ContractCallOptions = {
        functionName: 'stake',
        functionArgs: [100],
        cb: {
          onFinish: () => {},
          onCancel: () => {},
        },
      };

      expect(opts.functionName).toBe('stake');
      expect(opts.functionArgs).toEqual([100]);
    });
  });

  describe('CONTRACT_ERROR_CODES', () => {
    it('maps all 13 contract error codes', () => {
      expect(Object.keys(CONTRACT_ERROR_CODES)).toHaveLength(13);
    });

    it('maps error code 100 to ERR-NOT-AUTHORIZED', () => {
      expect(CONTRACT_ERROR_CODES[100]).toBe('ERR-NOT-AUTHORIZED');
    });

    it('maps error code 101 to ERR-PROPOSAL-NOT-FOUND', () => {
      expect(CONTRACT_ERROR_CODES[101]).toBe('ERR-PROPOSAL-NOT-FOUND');
    });

    it('maps error code 102 to ERR-INSUFFICIENT-STAKE', () => {
      expect(CONTRACT_ERROR_CODES[102]).toBe('ERR-INSUFFICIENT-STAKE');
    });

    it('maps error code 112 to ERR-PROPOSAL-EXPIRED', () => {
      expect(CONTRACT_ERROR_CODES[112]).toBe('ERR-PROPOSAL-EXPIRED');
    });

    it('covers all codes from 100 to 112', () => {
      const codes = Object.keys(CONTRACT_ERROR_CODES).map(Number);
      for (let i = 100; i <= 112; i++) {
        expect(codes).toContain(i);
      }
    });
  });

  describe('ContractErrorCode type', () => {
    it('is a numeric key of CONTRACT_ERROR_CODES', () => {
      const code: ContractErrorCode = 100;
      expect(CONTRACT_ERROR_CODES[code]).toBeDefined();
    });
  });

  describe('ContractErrorName type', () => {
    it('is a value of CONTRACT_ERROR_CODES', () => {
      const name: ContractErrorName = 'ERR-NOT-AUTHORIZED';
      expect(Object.values(CONTRACT_ERROR_CODES)).toContain(name);
    });
  });

  describe('ContractError', () => {
    it('has a required message and optional code', () => {
      const error: ContractError = {
        message: 'Not authorized',
        code: 100,
        name: 'ERR-NOT-AUTHORIZED',
      };

      expect(error.message).toBe('Not authorized');
      expect(error.code).toBe(100);
    });

    it('works with message only', () => {
      const error: ContractError = { message: 'Something failed' };
      expect(error.message).toBe('Something failed');
      expect(error.code).toBeUndefined();
    });
  });

  describe('NetworkError', () => {
    it('has a message and optional status', () => {
      const error: NetworkError = {
        message: 'Server Error',
        status: 500,
        statusText: 'Internal Server Error',
      };

      expect(error.message).toBe('Server Error');
      expect(error.status).toBe(500);
    });
  });

  describe('isErrorWithMessage', () => {
    it('returns true for objects with string message', () => {
      expect(isErrorWithMessage({ message: 'test' })).toBe(true);
    });

    it('returns true for Error instances', () => {
      expect(isErrorWithMessage(new Error('test'))).toBe(true);
    });

    it('returns false for null', () => {
      expect(isErrorWithMessage(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isErrorWithMessage(undefined)).toBe(false);
    });

    it('returns false for strings', () => {
      expect(isErrorWithMessage('error string')).toBe(false);
    });

    it('returns false for numbers', () => {
      expect(isErrorWithMessage(42)).toBe(false);
    });

    it('returns false for objects without message', () => {
      expect(isErrorWithMessage({ code: 100 })).toBe(false);
    });

    it('returns false for objects with non-string message', () => {
      expect(isErrorWithMessage({ message: 42 })).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('extracts message from Error objects', () => {
      expect(getErrorMessage(new Error('test error'))).toBe('test error');
    });

    it('extracts message from plain objects', () => {
      expect(getErrorMessage({ message: 'plain error' })).toBe('plain error');
    });

    it('uses string directly', () => {
      expect(getErrorMessage('raw string')).toBe('raw string');
    });

    it('returns default for null', () => {
      expect(getErrorMessage(null)).toBe('An unexpected error occurred');
    });

    it('returns default for undefined', () => {
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
    });

    it('returns custom fallback', () => {
      expect(getErrorMessage(null, 'Custom')).toBe('Custom');
    });

    it('returns default for numbers', () => {
      expect(getErrorMessage(42)).toBe('An unexpected error occurred');
    });

    it('returns default for empty object', () => {
      expect(getErrorMessage({})).toBe('An unexpected error occurred');
    });
  });

  describe('isNetworkError', () => {
    it('returns true for objects with numeric status', () => {
      expect(isNetworkError({ status: 500, message: 'fail' })).toBe(true);
    });

    it('returns false for null', () => {
      expect(isNetworkError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isNetworkError(undefined)).toBe(false);
    });

    it('returns false for strings', () => {
      expect(isNetworkError('error')).toBe(false);
    });

    it('returns false for objects without status', () => {
      expect(isNetworkError({ message: 'error' })).toBe(false);
    });

    it('returns false for objects with non-numeric status', () => {
      expect(isNetworkError({ status: 'bad' })).toBe(false);
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  isErrorResponse,
  isSuccessResponse,
} from './api';
import type {
  FetchProposalsResponse,
  VoteResponse,
  ErrorResponse,
} from './api';

describe('API Response types', () => {
  describe('isErrorResponse', () => {
    it('returns true for error responses', () => {
      const error: ErrorResponse = {
        success: false,
        error: 'Not found',
        timestamp: Date.now(),
      };
      expect(isErrorResponse(error)).toBe(true);
    });

    it('returns false for success responses', () => {
      const success: FetchProposalsResponse = {
        success: true,
        data: {
          proposals: [],
          totalCount: 0,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
        timestamp: Date.now(),
      };
      expect(isErrorResponse(success)).toBe(false);
    });

    it('returns false for non-objects', () => {
      expect(isErrorResponse(null)).toBe(false);
      expect(isErrorResponse('error')).toBe(false);
    });
  });

  describe('isSuccessResponse', () => {
    it('returns true for success responses', () => {
      const success: FetchProposalsResponse = {
        success: true,
        data: {
          proposals: [],
          totalCount: 0,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
        timestamp: Date.now(),
      };
      expect(isSuccessResponse(success)).toBe(true);
    });

    it('returns false for error responses', () => {
      const error: ErrorResponse = {
        success: false,
        error: 'Failed',
        timestamp: Date.now(),
      };
      expect(isSuccessResponse(error)).toBe(false);
    });

    it('returns false for responses without data', () => {
      const incomplete = {
        success: true,
        timestamp: Date.now(),
      };
      expect(isSuccessResponse(incomplete)).toBe(false);
    });
  });

  describe('API response structures', () => {
    it('structures FetchProposalsResponse correctly', () => {
      const response: FetchProposalsResponse = {
        success: true,
        data: {
          proposals: [],
          totalCount: 100,
          page: 1,
          pageSize: 10,
          totalPages: 10,
        },
        timestamp: Date.now(),
      };

      expect(response.success).toBe(true);
      expect(response.data?.totalCount).toBe(100);
    });

    it('structures VoteResponse correctly', () => {
      const response: VoteResponse = {
        success: true,
        data: {
          txId: 'abc123',
        },
        timestamp: Date.now(),
      };

      expect(response.success).toBe(true);
      expect(response.data?.txId).toBe('abc123');
    });

    it('structures error response correctly', () => {
      const response: ErrorResponse = {
        success: false,
        error: 'Unauthorized',
        code: '401',
        timestamp: Date.now(),
      };

      expect(response.success).toBe(false);
      expect(response.error).toBe('Unauthorized');
    });
  });
});

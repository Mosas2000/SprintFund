/**
 * API response type definitions and validators for Stacks contract calls.
 *
 * This module provides strict typing for all responses from read-only
 * contract functions and validates data before use throughout the app.
 */

import type {
  RawProposal,
  RawStake,
  RawVote,
  ProposalCountResponse,
  ProposalResponse,
  StakeResponse,
  MinStakeResponse,
  StakeInfo,
  VoteInfo,
  ProposalListResponse,
  ContractState,
} from './contract';

/**
 * BaseResponse provides common structure for all API responses.
 */
export interface BaseResponse {
  timestamp: number;
  success: boolean;
}

/**
 * SuccessResponse wraps data returned from successful API calls.
 * Generic parameter T represents the data type.
 */
export interface SuccessResponse<T> extends BaseResponse {
  success: true;
  data: T;
}

/**
 * ErrorResponse wraps error information.
 */
export interface ErrorResponse extends BaseResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Result type combining success and error scenarios.
 */
export type Result<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Response from get-proposal-count.
 */
export type GetProposalCountResult = Result<ProposalCountResponse>;

/**
 * Response from get-proposal.
 */
export type GetProposalResult = Result<ProposalResponse>;

/**
 * Response from get-stake.
 */
export type GetStakeResult = Result<StakeResponse>;

/**
 * Response from get-min-stake-amount.
 */
export type GetMinStakeResult = Result<MinStakeResponse>;

/**
 * Response from listing multiple proposals.
 */
export type GetProposalsResult = Result<ProposalListResponse>;

/**
 * Response from fetching stake info.
 */
export type GetStakeInfoResult = Result<StakeInfo>;

/**
 * Response from fetching vote info.
 */
export type GetVoteInfoResult = Result<VoteInfo>;

/**
 * Response from fetching contract state.
 */
export type GetContractStateResult = Result<ContractState>;

/**
 * Map of all read-only function response types.
 */
export interface ReadOnlyResponses {
  'get-proposal-count': ProposalCountResponse;
  'get-proposal': ProposalResponse;
  'get-stake': StakeResponse;
  'get-min-stake-amount': MinStakeResponse;
}

/**
 * Type-safe wrapper for read-only function responses.
 * Ensures responses are properly typed when calling different functions.
 */
export type ReadOnlyResponse<T extends keyof ReadOnlyResponses> = ReadOnlyResponses[T];

/**
 * Validators for Response types.
 */
export const isSuccessResponse = <T extends unknown>(
  response: unknown
): response is SuccessResponse<T> => {
  if (typeof response !== 'object' || response === null) return false;
  const obj = response as Record<string, unknown>;
  return (
    obj.success === true &&
    typeof obj.timestamp === 'number' &&
    'data' in obj
  );
};

/**
 * Check if response is an error response.
 */
export const isErrorResponse = (response: unknown): response is ErrorResponse => {
  if (typeof response !== 'object' || response === null) return false;
  const obj = response as Record<string, unknown>;
  return (
    obj.success === false &&
    typeof obj.timestamp === 'number' &&
    'error' in obj
  );
};

/**
 * Extract error message from result.
 */
export const getErrorFromResult = (result: ErrorResponse): string => {
  return result.error?.message || 'An unknown error occurred';
};

/**
 * Extract data from successful result or throw error.
 */
export const extractResultData = <T>(result: Result<T>): T => {
  if (isSuccessResponse<T>(result)) {
    return result.data;
  }
  throw new Error(getErrorFromResult(result as ErrorResponse));
};

/**
 * Factory for creating success responses.
 */
export const createSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
  success: true,
  data,
  timestamp: Date.now(),
});

/**
 * Factory for creating error responses.
 */
export const createErrorResponse = (
  message: string,
  code?: string,
  details?: Record<string, unknown>
): ErrorResponse => ({
  success: false,
  timestamp: Date.now(),
  error: {
    message,
    code,
    details,
  },
});

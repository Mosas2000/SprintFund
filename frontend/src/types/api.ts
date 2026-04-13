/**
 * Types for API requests and responses related to governance operations.
 */

import type {
  ProposalPage,
  StakeInfo,
  VoteRecord,
  CreateProposalInput,
} from '../types';

/**
 * Request payload for fetching proposals.
 */
export interface FetchProposalsRequest {
  page?: number;
  pageSize?: number;
  status?: 'all' | 'active' | 'executed';
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'most-votes';
  search?: string;
  forceRefresh?: boolean;
}

/**
 * Response containing proposals with pagination.
 */
export interface FetchProposalsResponse {
  success: boolean;
  data?: ProposalPage;
  error?: string;
  timestamp: number;
}

/**
 * Request payload for creating a proposal.
 */
export type CreateProposalRequest = CreateProposalInput;

/**
 * Response from proposal creation.
 */
export interface CreateProposalResponse {
  success: boolean;
  data?: {
    txId: string;
    proposalId?: number;
  };
  error?: string;
  timestamp: number;
}

/**
 * Request payload for voting on a proposal.
 */
export interface VoteRequest {
  proposalId: number;
  support: boolean;
  weight: number;
}

/**
 * Response from voting operation.
 */
export interface VoteResponse {
  success: boolean;
  data?: {
    txId: string;
    voteId?: string;
  };
  error?: string;
  timestamp: number;
}

/**
 * Request payload for staking.
 */
export interface StakeRequest {
  amount: number;
}

/**
 * Response from staking operation.
 */
export interface StakeResponse {
  success: boolean;
  data?: {
    txId: string;
  };
  error?: string;
  timestamp: number;
}

/**
 * Request payload for fetching user stake info.
 */
export interface FetchStakeRequest {
  address: string;
}

/**
 * Response with user stake information.
 */
export interface FetchStakeResponse {
  success: boolean;
  data?: StakeInfo;
  error?: string;
  timestamp: number;
}

/**
 * Request payload for fetching voting history.
 */
export interface FetchVotingHistoryRequest {
  address: string;
  limit?: number;
  offset?: number;
}

/**
 * Response with voting history.
 */
export interface FetchVotingHistoryResponse {
  success: boolean;
  data?: {
    votes: VoteRecord[];
    totalCount: number;
  };
  error?: string;
  timestamp: number;
}

/**
 * Generic error response from any API call.
 */
export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  timestamp: number;
}

/**
 * Type guard for checking if response is an error.
 */
export function isErrorResponse(response: unknown): response is ErrorResponse {
  if (!response || typeof response !== 'object') return false;
  const obj = response as Record<string, unknown>;
  return obj.success === false && typeof obj.error === 'string';
}

/**
 * Type guard for checking if response is successful.
 */
export function isSuccessResponse<T>(
  response: unknown,
): response is { success: true; data: T; timestamp: number } {
  if (!response || typeof response !== 'object') return false;
  const obj = response as Record<string, unknown>;
  return obj.success === true && 'data' in obj;
}

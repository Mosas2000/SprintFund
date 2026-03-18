/**
 * Complete re-export barrel for all type-safe utilities.
 *
 * This file provides a single import point for all TypeScript type utilities,
 * validators, and helper functions throughout the application.
 *
 * Usage:
 * ```typescript
 * import {
 *   Proposal,
 *   validateRawProposal,
 *   isValidProposal,
 *   enrichProposal,
 * } from '@/lib/all-types';
 * ```
 */

// Types - re-export from types directory
export type {
  Proposal,
  ProposalWithStats,
  CreateProposalInput,
  ProposalPage,
} from '../types/proposal';

export type { VoteInput, VoteRecord, UserVotingHistory, VotingStats } from '../types/voting';

export type { StakeInfo, StakeInput, MinStakeInfo, StakeHistoryEntry } from '../types/stake';

export type {
  FetchProposalsRequest,
  FetchProposalsResponse,
  CreateProposalRequest,
  CreateProposalResponse,
  VoteRequest,
  VoteResponse,
  ErrorResponse,
} from '../types/api';

export type {
  WsMessage,
  ProposalUpdate,
  VoteUpdate,
  StakeUpdate,
  ConnectionState,
} from '../types/realtime';

export type {
  AppConfig,
  NetworkConfig,
  ContractConfig,
  FeatureFlags,
} from '../types/config';

export type {
  RawProposal,
  RawStake,
  ClarityValue,
  ContractError,
} from '../types/contract';

// Validators
export {
  unwrapClarityValue,
  validateRawProposal,
  rawProposalToProposal,
  validateCreateProposalInput,
  validateProposalCount,
  validateStxAmount,
  isProposal,
  isProposalArray,
} from './validators';

// Type Guards
export {
  isValidProposal,
  isValidProposalPage,
  isValidStakeInfo,
  isValidVoteRecord,
  isValidPrincipal,
  isValidTxId,
  filterValidProposals,
  narrowProposal,
} from './type-guards';

// Type Converters
export {
  convertRawToProposal,
  convertToProposalWithStats,
  convertRawToStake,
  createProposalPage,
  safeProposal,
  safeProposalPage,
} from './type-converters';

// Proposal Utilities
export {
  calculateTotalVotes,
  calculateForPercentage,
  enrichProposal,
  filterProposalsByStatus,
  sortProposals,
  wouldProposalPass,
} from './proposal-utils';

// Voting & Stake Utilities
export {
  calculateVotingPower,
  canUserVote,
  calculateQuorumPercentage,
  isQuorumReached,
  calculateTotalStaked,
  aggregateVotingStats,
  hasUserVoted,
  formatStxAmount,
} from './voting-stake-utils';

// Result Type & Helpers
export {
  success,
  error,
  getOrThrow,
  getOrDefault,
  chain,
  validateAll,
  asyncSuccess,
  asyncError,
  PaginationHelper,
  TypeCache,
} from './type-helpers';

export type { Result, AsyncResult } from './type-helpers';

// Governance Utilities
export {
  searchProposals,
  calculateProposalStats,
  buildVoterProfile,
  analyzeVotingPowerDistribution,
} from './governance-utils';

// Storage Utilities
export { TypedStorage, SessionCache, PersistentCache } from './typed-storage';

// Logger
export { Logger, TypedTimer, LogLevel, logger } from './typed-logger';

export type { LogEvent } from './typed-logger';

// Config
export { getAppEnvironment, isDevelopment, isProduction } from '../types/config';

// API Guards
export { isErrorResponse, isSuccessResponse } from '../types/api';

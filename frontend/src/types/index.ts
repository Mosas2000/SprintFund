/**
 * Types barrel export file
 * 
 * Re-exports all type definitions for convenient imports.
 * Usage: import { Proposal, VotingData } from '@/types';
 */

// Core proposal types
export type {
  Proposal,
  ProposalWithStats,
  CreateProposalInput,
  CreateProposalResult,
  ProposalPage,
  ProposalQueryOptions,
  ProposalCacheEntry,
  ProposalCountResult,
} from './proposal';

// Governance types
export type {
  VotingData,
  SentimentResult,
  ProposalSummary,
} from '../../types/governance';

// Analytics types
export type {
  AnalyticsData,
  ChartDataPoint,
} from './analytics';

// API types
export type {
  ApiResponse,
  ApiError,
} from './api';

// Contract types
export type {
  ContractCallOptions,
  TransactionResult,
} from './contract';

// Notification types
export type {
  Notification,
  NotificationSettings,
} from './notification';

// Profile types
export type {
  UserProfile,
  ProfileStats,
} from './profile';

// Comment types
export type {
  Comment,
  CommentThread,
} from './comment';

// Transaction types
export type {
  Transaction,
  TransactionStatus,
} from './transaction';

// Voting types
export type {
  Vote,
  VoteHistory,
} from './voting';

// Balance types
export type {
  Balance,
  BalanceHistory,
} from './balance';

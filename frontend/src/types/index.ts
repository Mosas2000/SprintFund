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

// Re-export governance types from types directory
export type {
  VotingData,
  SentimentResult,
} from '../../types/governance';

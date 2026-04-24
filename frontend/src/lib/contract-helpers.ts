/**
 * Utilities for working with contract response types safely.
 * Provides helper functions for extracting, validating, and transforming contract data.
 */

import type {
  ProposalCountResponse,
  ProposalResponse,
  StakeResponse,
  MinStakeResponse,
  RawProposal,
  RawStake,
} from '../types/contract';

/**
 * Safe wrapper for contract read-only calls.
 * Provides type-safe access to contract data with null coalescing.
 */
export class ContractResponseHandler {
  /**
   * Extract proposal count or return 0.
   */
  static extractProposalCount(response: ProposalCountResponse | null): number {
    return typeof response === 'number' ? Math.max(0, response) : 0;
  }

  /**
   * Extract stake amount or return 0.
   */
  static extractStakeAmount(response: StakeResponse | null): number {
    if (!response || typeof response !== 'object') return 0;
    const obj = response as unknown as Record<string, unknown>;
    const amount = obj.amount;
    if (typeof amount === 'number') return Math.max(0, amount);
    if (typeof amount === 'object' && amount !== null && 'value' in amount) {
      const val = (amount as Record<string, unknown>).value;
      return typeof val === 'number' ? Math.max(0, val) : 0;
    }
    return 0;
  }

  /**
   * Extract minimum stake amount or return default.
   */
  static extractMinStakeAmount(response: MinStakeResponse | null): number {
    return typeof response === 'number' ? Math.max(0, response) : 10_000_000;
  }

  /**
   * Safely check if proposal has valid structure.
   */
  static isValidProposalResponse(response: unknown): response is ProposalResponse {
    if (!response || typeof response !== 'object') return false;
    const obj = response as Record<string, unknown>;
    return (
      'proposer' in obj &&
      'amount' in obj &&
      'title' in obj &&
      'description' in obj &&
      'votes-for' in obj &&
      'votes-against' in obj &&
      'executed' in obj &&
      'created-at' in obj
    );
  }

  /**
   * Safely check if stake has valid structure.
   */
  static isValidStakeResponse(response: unknown): response is StakeResponse {
    if (!response || typeof response !== 'object') return false;
    const obj = response as Record<string, unknown>;
    return 'amount' in obj;
  }
}

/**
 * Type-safe builders for contract transactions.
 */
export class TransactionBuilder {
  /**
   * Validate and build stake amount for transaction.
   */
  static buildStakeAmount(amount: number): number {
    const validated = Math.floor(amount);
    if (validated <= 0 || !Number.isFinite(validated)) {
      throw new Error('Invalid stake amount: must be positive');
    }
    return validated;
  }

  /**
   * Validate and build proposal amount for transaction.
   */
  static buildProposalAmount(amount: number): number {
    const validated = Math.floor(amount);
    if (validated <= 0 || !Number.isFinite(validated)) {
      throw new Error('Invalid proposal amount: must be positive');
    }
    return validated;
  }

  /**
   * Validate and sanitize proposal title.
   */
  static buildProposalTitle(title: string): string {
    const trimmed = title.trim();
    if (trimmed.length < 3 || trimmed.length > 200) {
      throw new Error('Title must be between 3 and 200 characters');
    }
    return trimmed;
  }

  /**
   * Validate and sanitize proposal description.
   */
  static buildProposalDescription(description: string): string {
    const trimmed = description.trim();
    if (trimmed.length < 10 || trimmed.length > 2000) {
      throw new Error('Description must be between 10 and 2000 characters');
    }
    return trimmed;
  }

  /**
   * Validate vote weight for transaction.
   */
  static buildVoteWeight(weight: number): number {
    const validated = Math.floor(weight);
    if (validated <= 0 || !Number.isFinite(validated)) {
      throw new Error('Vote weight must be positive');
    }
    return validated;
  }
}

/**
 * Conversion utilities for contract data.
 */
export class ContractConverter {
  /**
   * Convert microSTX to STX for display.
   */
  static microSTXToSTX(microSTX: number): number {
    return microSTX / 1_000_000;
  }

  /**
   * Convert STX to microSTX for contract calls.
   */
  static STXToMicroSTX(stx: number): number {
    return Math.floor(stx * 1_000_000);
  }

  /**
   * Format proposal ID for display.
   */
  static formatProposalId(id: number): string {
    return `#${id}`;
  }

  /**
   * Calculate voting power percentage.
   */
  static calculateVotingPower(userVotes: number, totalVotes: number): number {
    if (totalVotes === 0) return 0;
    return (userVotes / totalVotes) * 100;
  }

  /**
   * Calculate proposal status based on votes.
   */
  static getProposalStatus(
    votesFor: number,
    votesAgainst: number,
    executed: boolean
  ): 'passing' | 'failing' | 'executed' {
    if (executed) return 'executed';
    return votesFor > votesAgainst ? 'passing' : 'failing';
  }
}

import { normalizeError, isNormalizedRetryable } from './error-normalizer';

/**
 * Error recovery utilities for failed contract calls.
 */
export class ErrorRecovery {
  /**
   * Determine if error is retryable.
   */
  static isRetryable(error: unknown): boolean {
    return isNormalizedRetryable(error);
  }

  /**
   * Get retry delay in milliseconds.
   */
  static getRetryDelay(attemptNumber: number): number {
    const baseDelay = 1000;
    const exponentialBackoff = Math.pow(2, Math.min(attemptNumber, 5));
    const jitter = Math.random() * 1000;
    return baseDelay * exponentialBackoff + jitter;
  }

  /**
   * Check if error looks like authentication failure.
   */
  static isAuthError(error: unknown): boolean {
    const normalized = normalizeError(error);
    return (
      normalized.rawMessage.toLowerCase().includes('unauthorized') ||
      normalized.rawMessage.toLowerCase().includes('forbidden') ||
      normalized.rawMessage.toLowerCase().includes('not authenticated') ||
      normalized.rawMessage.toLowerCase().includes('wallet not connected') ||
      normalized.rawCode === 'UNAUTHORIZED'
    );
  }
}

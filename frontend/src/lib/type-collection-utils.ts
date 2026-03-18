/**
 * Advanced TypeScript type utilities and decorators.
 * Provides sophisticated type operations for complex scenarios.
 */

import type { Proposal } from '../types';

/**
 * Type-safe cache for proposals with TTL support.
 */
export class ProposalCache {
  private cache: Map<number, { data: Proposal; timestamp: number }> = new Map();
  private readonly ttl: number;

  constructor(ttlMs: number = 30_000) {
    this.ttl = ttlMs;
  }

  /**
   * Store proposal with timestamp.
   */
  set(id: number, proposal: Proposal): void {
    this.cache.set(id, {
      data: proposal,
      timestamp: Date.now(),
    });
  }

  /**
   * Get proposal if cached and not expired.
   */
  get(id: number): Proposal | null {
    const entry = this.cache.get(id);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(id);
      return null;
    }

    return entry.data;
  }

  /**
   * Check if proposal is cached.
   */
  has(id: number): boolean {
    return this.get(id) !== null;
  }

  /**
   * Clear entire cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size.
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Remove expired entries.
   */
  cleanExpired(): number {
    let removed = 0;
    const now = Date.now();

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.ttl) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }
}

/**
 * Type-safe collection for proposals with filtering.
 */
export class ProposalCollection {
  private proposals: Proposal[] = [];

  /**
   * Add proposals to collection.
   */
  add(...proposals: Proposal[]): void {
    this.proposals.push(...proposals);
  }

  /**
   * Get all proposals.
   */
  getAll(): Proposal[] {
    return [...this.proposals];
  }

  /**
   * Filter by execution status.
   */
  getActive(): Proposal[] {
    return this.proposals.filter((p) => !p.executed);
  }

  /**
   * Get executed proposals.
   */
  getExecuted(): Proposal[] {
    return this.proposals.filter((p) => p.executed);
  }

  /**
   * Filter by proposer.
   */
  getByProposer(proposer: string): Proposal[] {
    return this.proposals.filter((p) => p.proposer === proposer);
  }

  /**
   * Filter by minimum votes.
   */
  getHighVoteCount(minVotes: number): Proposal[] {
    return this.proposals.filter(
      (p) => p.votesFor + p.votesAgainst >= minVotes
    );
  }

  /**
   * Sort by creation date descending.
   */
  sortByNewest(): Proposal[] {
    return [...this.proposals].sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Sort by creation date ascending.
   */
  sortByOldest(): Proposal[] {
    return [...this.proposals].sort((a, b) => a.createdAt - b.createdAt);
  }

  /**
   * Sort by vote count descending.
   */
  sortByMostVotes(): Proposal[] {
    return [...this.proposals].sort(
      (a, b) =>
        (b.votesFor + b.votesAgainst) - (a.votesFor + a.votesAgainst)
    );
  }

  /**
   * Get total proposals count.
   */
  count(): number {
    return this.proposals.length;
  }

  /**
   * Clear all proposals.
   */
  clear(): void {
    this.proposals = [];
  }
}

/**
 * Type-safe aggregator for proposal statistics.
 */
export class ProposalAggregator {
  /**
   * Calculate average votes per proposal.
   */
  static averageVotes(proposals: Proposal[]): number {
    if (proposals.length === 0) return 0;
    const totalVotes = proposals.reduce(
      (sum, p) => sum + p.votesFor + p.votesAgainst,
      0
    );
    return totalVotes / proposals.length;
  }

  /**
   * Calculate total funding requested.
   */
  static totalFundingRequested(proposals: Proposal[]): number {
    return proposals.reduce((sum, p) => sum + p.amount, 0);
  }

  /**
   * Calculate voting power distribution.
   */
  static votingDistribution(proposals: Proposal[]): {
    forPercentage: number;
    againstPercentage: number;
  } {
    const totalFor = proposals.reduce((sum, p) => sum + p.votesFor, 0);
    const totalAgainst = proposals.reduce((sum, p) => sum + p.votesAgainst, 0);
    const total = totalFor + totalAgainst;

    if (total === 0) return { forPercentage: 0, againstPercentage: 0 };

    return {
      forPercentage: (totalFor / total) * 100,
      againstPercentage: (totalAgainst / total) * 100,
    };
  }

  /**
   * Get execution rate.
   */
  static executionRate(proposals: Proposal[]): number {
    if (proposals.length === 0) return 0;
    const executed = proposals.filter((p) => p.executed).length;
    return (executed / proposals.length) * 100;
  }

  /**
   * Find proposal with highest votes for.
   */
  static maxVotesFor(proposals: Proposal[]): Proposal | null {
    if (proposals.length === 0) return null;
    return proposals.reduce((max, p) =>
      p.votesFor > max.votesFor ? p : max
    );
  }

  /**
   * Find proposal with highest votes against.
   */
  static maxVotesAgainst(proposals: Proposal[]): Proposal | null {
    if (proposals.length === 0) return null;
    return proposals.reduce((max, p) =>
      p.votesAgainst > max.votesAgainst ? p : max
    );
  }

  /**
   * Find proposal with highest requested amount.
   */
  static maxAmount(proposals: Proposal[]): Proposal | null {
    if (proposals.length === 0) return null;
    return proposals.reduce((max, p) => (p.amount > max.amount ? p : max));
  }
}

/**
 * Type-safe builder for complex proposal filters.
 */
export class ProposalFilterBuilder {
  private status?: 'active' | 'executed' | 'all';
  private minVotes?: number;
  private maxVotes?: number;
  private proposer?: string;
  private minAmount?: number;
  private maxAmount?: number;

  /**
   * Set execution status filter.
   */
  withStatus(status: 'active' | 'executed' | 'all'): this {
    this.status = status;
    return this;
  }

  /**
   * Set minimum votes filter.
   */
  withMinVotes(min: number): this {
    this.minVotes = Math.max(0, min);
    return this;
  }

  /**
   * Set maximum votes filter.
   */
  withMaxVotes(max: number): this {
    this.maxVotes = Math.max(0, max);
    return this;
  }

  /**
   * Set proposer filter.
   */
  withProposer(address: string): this {
    this.proposer = address;
    return this;
  }

  /**
   * Set minimum amount filter.
   */
  withMinAmount(min: number): this {
    this.minAmount = Math.max(0, min);
    return this;
  }

  /**
   * Set maximum amount filter.
   */
  withMaxAmount(max: number): this {
    this.maxAmount = Math.max(0, max);
    return this;
  }

  /**
   * Build predicate function for filtering.
   */
  build(): (proposal: Proposal) => boolean {
    return (proposal: Proposal): boolean => {
      if (this.status === 'active' && proposal.executed) return false;
      if (this.status === 'executed' && !proposal.executed) return false;

      const totalVotes = proposal.votesFor + proposal.votesAgainst;
      if (this.minVotes !== undefined && totalVotes < this.minVotes) return false;
      if (this.maxVotes !== undefined && totalVotes > this.maxVotes) return false;

      if (this.proposer && proposal.proposer !== this.proposer) return false;

      if (this.minAmount !== undefined && proposal.amount < this.minAmount)
        return false;
      if (this.maxAmount !== undefined && proposal.amount > this.maxAmount)
        return false;

      return true;
    };
  }
}

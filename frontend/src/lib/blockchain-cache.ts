import type { Proposal, ProposalPage } from '../types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  lastReset: number;
  hitRate?: number;
}

class BlockchainDataCache {
  private proposals = new Map<number, CacheEntry<Proposal>>();
  private proposalPages = new Map<string, CacheEntry<ProposalPage>>();
  private proposalCounts = new Map<string, CacheEntry<number>>();
  private stakes = new Map<string, CacheEntry<number>>();
  private minStakeAmounts = new Map<string, CacheEntry<number>>();

  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    lastReset: Date.now(),
  };

  private readonly DEFAULT_TTL_MS = 10 * 60 * 1000;
  private readonly SHORT_TTL_MS = 30 * 1000;
  private readonly LONG_TTL_MS = 60 * 60 * 1000;

  setProposal(id: number, proposal: Proposal, ttl: number = this.DEFAULT_TTL_MS): void {
    this.proposals.set(id, {
      data: proposal,
      timestamp: Date.now(),
      ttl,
    });
  }

  getProposal(id: number): Proposal | null {
    return this.getCachedEntry(this.proposals.get(id));
  }

  setProposalPage(
    page: number,
    pageSize: number,
    data: ProposalPage,
    ttl: number = this.DEFAULT_TTL_MS,
  ): void {
    const key = `page-${page}-size-${pageSize}`;
    this.proposalPages.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  getProposalPage(page: number, pageSize: number): ProposalPage | null {
    const key = `page-${page}-size-${pageSize}`;
    return this.getCachedEntry(this.proposalPages.get(key));
  }

  setProposalCount(count: number, ttl: number = this.DEFAULT_TTL_MS): void {
    this.proposalCounts.set('global', {
      data: count,
      timestamp: Date.now(),
      ttl,
    });
  }

  getProposalCount(): number | null {
    return this.getCachedEntry(this.proposalCounts.get('global'));
  }

  setStake(address: string, amount: number, ttl: number = this.DEFAULT_TTL_MS): void {
    this.stakes.set(address, {
      data: amount,
      timestamp: Date.now(),
      ttl,
    });
  }

  getStake(address: string): number | null {
    return this.getCachedEntry(this.stakes.get(address));
  }

  setMinStakeAmount(amount: number, ttl: number = this.LONG_TTL_MS): void {
    this.minStakeAmounts.set('global', {
      data: amount,
      timestamp: Date.now(),
      ttl,
    });
  }

  getMinStakeAmount(): number | null {
    return this.getCachedEntry(this.minStakeAmounts.get('global'));
  }

  private getCachedEntry<T>(entry: CacheEntry<T> | undefined): T | null {
    if (!entry) {
      this.stats.misses += 1;
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.stats.misses += 1;
      return null;
    }

    this.stats.hits += 1;
    return entry.data;
  }

  invalidateProposal(id: number): void {
    this.proposals.delete(id);
  }

  invalidateProposalPages(): void {
    this.proposalPages.clear();
  }

  invalidateProposalCount(): void {
    this.proposalCounts.clear();
  }

  invalidateStake(address: string): void {
    this.stakes.delete(address);
  }

  invalidateAll(): void {
    this.proposals.clear();
    this.proposalPages.clear();
    this.proposalCounts.clear();
    this.stakes.clear();
  }

  getStats(): CacheStats {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
      : 0;

    return {
      ...this.stats,
      hitRate: parseFloat(hitRate as any),
    };
  }

  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      lastReset: Date.now(),
    };
  }

  getSize(): number {
    return (
      this.proposals.size +
      this.proposalPages.size +
      this.proposalCounts.size +
      this.stakes.size +
      this.minStakeAmounts.size
    );
  }

  clear(): void {
    this.invalidateAll();
    this.resetStats();
  }
}

export const blockchainCache = new BlockchainDataCache();

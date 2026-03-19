import { blockchainCache } from './blockchain-cache';
import { getProposalCount, getMinStakeAmount } from './stacks';

export interface CachePreloadOptions {
  loadProposalCount?: boolean;
  loadMinStake?: boolean;
  loadFirstPageProposals?: boolean;
  pageSize?: number;
}

const DEFAULT_PRELOAD_OPTIONS: CachePreloadOptions = {
  loadProposalCount: true,
  loadMinStake: true,
  loadFirstPageProposals: false,
  pageSize: 10,
};

export class CachePreloader {
  static async preloadEssentialData(
    options: CachePreloadOptions = DEFAULT_PRELOAD_OPTIONS,
  ): Promise<void> {
    const opts = { ...DEFAULT_PRELOAD_OPTIONS, ...options };

    try {
      if (opts.loadProposalCount) {
        await this.preloadProposalCount();
      }

      if (opts.loadMinStake) {
        await this.preloadMinStake();
      }

      if (opts.loadFirstPageProposals) {
        await this.preloadFirstPageProposals(opts.pageSize!);
      }
    } catch (err) {
      console.warn('Cache preload failed:', err);
    }
  }

  private static async preloadProposalCount(): Promise<void> {
    const timestamp = Date.now();
    await getProposalCount();
    const duration = Date.now() - timestamp;
    console.log(`Preloaded proposal count in ${duration}ms`);
  }

  private static async preloadMinStake(): Promise<void> {
    const timestamp = Date.now();
    await getMinStakeAmount();
    const duration = Date.now() - timestamp;
    console.log(`Preloaded min stake in ${duration}ms`);
  }

  private static async preloadFirstPageProposals(pageSize: number): Promise<void> {
    // This would require reimporting to avoid circular dependency
    // Best practice: call from component, not here
    console.log('First page preload should be done from component');
  }

  static isDataCached(): boolean {
    return (
      blockchainCache.getProposalCount() !== null &&
      blockchainCache.getMinStakeAmount() !== null
    );
  }

  static getCacheWarmupStatus(): {
    proposalCount: boolean;
    minStake: boolean;
  } {
    return {
      proposalCount: blockchainCache.getProposalCount() !== null,
      minStake: blockchainCache.getMinStakeAmount() !== null,
    };
  }
}

export async function initializeCacheOnAppStart(): Promise<void> {
  await CachePreloader.preloadEssentialData({
    loadProposalCount: true,
    loadMinStake: true,
    loadFirstPageProposals: false,
  });
}

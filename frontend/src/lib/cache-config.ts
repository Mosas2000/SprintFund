export interface CacheConfig {
  enabled: boolean;
  defaultTtlMs: number;
  proposalTtlMs: number;
  proposalPageTtlMs: number;
  proposalCountTtlMs: number;
  stakeTtlMs: number;
  minStakeTtlMs: number;
  enableMetrics: boolean;
  enablePersistence: boolean;
  metricsUpdateIntervalMs: number;
}

const DEFAULT_CONFIG: CacheConfig = {
  enabled: true,
  defaultTtlMs: 10 * 60 * 1000,
  proposalTtlMs: 10 * 60 * 1000,
  proposalPageTtlMs: 10 * 60 * 1000,
  proposalCountTtlMs: 10 * 60 * 1000,
  stakeTtlMs: 10 * 60 * 1000,
  minStakeTtlMs: 60 * 60 * 1000,
  enableMetrics: false,
  enablePersistence: true,
  metricsUpdateIntervalMs: 5000,
};

class CacheConfigManager {
  private config: CacheConfig = { ...DEFAULT_CONFIG };
  private listeners: Set<(config: CacheConfig) => void> = new Set();

  getConfig(): CacheConfig {
    return { ...this.config };
  }

  updateConfig(partial: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...partial };
    this.notifyListeners();
  }

  resetConfig(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.notifyListeners();
  }

  subscribe(listener: (config: CacheConfig) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener(this.getConfig());
    });
  }

  getTtlFor(dataType: 'proposal' | 'page' | 'count' | 'stake' | 'minStake'): number {
    switch (dataType) {
      case 'proposal':
        return this.config.proposalTtlMs;
      case 'page':
        return this.config.proposalPageTtlMs;
      case 'count':
        return this.config.proposalCountTtlMs;
      case 'stake':
        return this.config.stakeTtlMs;
      case 'minStake':
        return this.config.minStakeTtlMs;
      default:
        return this.config.defaultTtlMs;
    }
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  metricsEnabled(): boolean {
    return this.config.enableMetrics;
  }

  persistenceEnabled(): boolean {
    return this.config.enablePersistence;
  }
}

export const cacheConfigManager = new CacheConfigManager();

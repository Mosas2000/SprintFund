import { blockchainCache } from './blockchain-cache';
import { localStorageCache } from './persistent-cache';
import { cacheMetricsCollector, CacheMetrics } from './cache-metrics';
import { cacheConfigManager, CacheConfig } from './cache-config';

interface CacheStats {
  hits: number;
  misses: number;
  lastReset: number;
  hitRate?: number;
}

interface CacheDebugInfo {
  inMemorySize: number;
  localStorageSize: number;
  metrics: CacheMetrics;
  config: CacheConfig;
  stats: CacheStats;
}

export class CacheDebugger {
  static logCacheStatus(): void {
    console.group('Cache Status');
    console.log('In-Memory Cache Size:', blockchainCache.getSize());
    console.log('LocalStorage Cache Size:', localStorageCache.getSize());
    console.log('Stats:', blockchainCache.getStats());
    console.log('Config:', cacheConfigManager.getConfig());
    console.groupEnd();
  }

  static getDebugInfo(): CacheDebugInfo {
    return {
      inMemorySize: blockchainCache.getSize(),
      localStorageSize: localStorageCache.getSize(),
      metrics: cacheMetricsCollector.getMetrics(blockchainCache),
      config: cacheConfigManager.getConfig(),
      stats: blockchainCache.getStats(),
    };
  }

  static clearAllCache(): void {
    blockchainCache.clear();
    localStorageCache.clear();
    console.log('All caches cleared');
  }

  static exportCacheDebugData(): string {
    const data = {
      timestamp: new Date().toISOString(),
      debugInfo: this.getDebugInfo(),
      summary: cacheMetricsCollector.getSummary(blockchainCache),
    };
    return JSON.stringify(data, null, 2);
  }

  static downloadCacheDebugData(): void {
    const data = this.exportCacheDebugData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cache-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static validateCacheIntegrity(): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    const stats = blockchainCache.getStats();
    const hitRate = stats.hitRate ?? 0;
    if (hitRate < 0 || hitRate > 100) {
      errors.push('Invalid hit rate calculated');
    }

    if (blockchainCache.getSize() < 0) {
      errors.push('Invalid cache size');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static setupDebugListener(): void {
    setInterval(() => {
      const info = this.getDebugInfo();
      (window as any).__CACHE_DEBUG_INFO__ = info;
    }, 5000);

    (window as any).__CACHE_DEBUG__ = {
      status: () => this.logCacheStatus(),
      clear: () => this.clearAllCache(),
      info: () => this.getDebugInfo(),
      export: () => this.exportCacheDebugData(),
      validate: () => this.validateCacheIntegrity(),
    };

    console.log('Cache debugger available as window.__CACHE_DEBUG__');
  }
}

export function enableCacheDebugMode(): void {
  CacheDebugger.setupDebugListener();
  console.log('Cache debug mode enabled');
  console.log('Use window.__CACHE_DEBUG__ for access');
}

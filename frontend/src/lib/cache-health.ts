import { blockchainCache } from './blockchain-cache';
import { localStorageCache } from './persistent-cache';
import { cacheConfigManager } from './cache-config';

export interface HealthCheckResult {
  healthy: boolean;
  checks: {
    name: string;
    status: 'pass' | 'fail';
    message: string;
  }[];
  timestamp: number;
}

export class CacheHealthCheck {
  static async runHealthCheck(): Promise<HealthCheckResult> {
    const checks = [
      this.checkCacheEnabled(),
      this.checkMemoryCache(),
      this.checkLocalStorage(),
      this.checkConfiguration(),
      this.checkMetricsIntegrity(),
    ];

    const healthy = checks.every((c) => c.status === 'pass');

    return {
      healthy,
      checks,
      timestamp: Date.now(),
    };
  }

  private static checkCacheEnabled(): {
    name: string;
    status: 'pass' | 'fail';
    message: string;
  } {
    const isEnabled = cacheConfigManager.isEnabled();
    return {
      name: 'Cache Enabled',
      status: isEnabled ? 'pass' : 'fail',
      message: isEnabled
        ? 'Caching system is enabled'
        : 'Caching system is disabled',
    };
  }

  private static checkMemoryCache(): {
    name: string;
    status: 'pass' | 'fail';
    message: string;
  } {
    const size = blockchainCache.getSize();
    const stats = blockchainCache.getStats();

    if (stats.hits + stats.misses === 0) {
      return {
        name: 'In-Memory Cache',
        status: 'pass',
        message: 'Cache initialized and ready (no requests yet)',
      };
    }

    if (stats.hitRate >= 60) {
      return {
        name: 'In-Memory Cache',
        status: 'pass',
        message: `Cache operating normally (${stats.hitRate.toFixed(1)}% hit rate)`,
      };
    }

    if (stats.hitRate >= 40) {
      return {
        name: 'In-Memory Cache',
        status: 'pass',
        message: `Cache working but hit rate low (${stats.hitRate.toFixed(1)}%)`,
      };
    }

    return {
      name: 'In-Memory Cache',
      status: 'fail',
      message: `Cache hit rate critically low (${stats.hitRate.toFixed(1)}%)`,
    };
  }

  private static checkLocalStorage(): {
    name: string;
    status: 'pass' | 'fail';
    message: string;
  } {
    if (!cacheConfigManager.persistenceEnabled()) {
      return {
        name: 'Persistent Cache',
        status: 'pass',
        message: 'Persistence disabled (optional feature)',
      };
    }

    try {
      const size = localStorageCache.getSize();
      return {
        name: 'Persistent Cache',
        status: 'pass',
        message: `LocalStorage cache available (${size} entries)`,
      };
    } catch (err) {
      return {
        name: 'Persistent Cache',
        status: 'fail',
        message: 'LocalStorage unavailable or disabled',
      };
    }
  }

  private static checkConfiguration(): {
    name: string;
    status: 'pass' | 'fail';
    message: string;
  } {
    const config = cacheConfigManager.getConfig();

    if (
      config.proposalTtlMs <= 0 ||
      config.stakeTtlMs <= 0 ||
      config.proposalCountTtlMs <= 0
    ) {
      return {
        name: 'Configuration',
        status: 'fail',
        message: 'Invalid TTL values detected',
      };
    }

    return {
      name: 'Configuration',
      status: 'pass',
      message: 'Configuration valid and reasonable',
    };
  }

  private static checkMetricsIntegrity(): {
    name: string;
    status: 'pass' | 'fail';
    message: string;
  } {
    const stats = blockchainCache.getStats();

    if (stats.hits < 0 || stats.misses < 0) {
      return {
        name: 'Metrics Integrity',
        status: 'fail',
        message: 'Invalid metric values',
      };
    }

    if (isNaN(stats.hitRate) && stats.hits + stats.misses > 0) {
      return {
        name: 'Metrics Integrity',
        status: 'fail',
        message: 'Hit rate calculation error',
      };
    }

    return {
      name: 'Metrics Integrity',
      status: 'pass',
      message: 'Metrics valid and accurate',
    };
  }

  static getHealthStatus(): string {
    // Synchronous quick check
    const cacheEnabled = cacheConfigManager.isEnabled();
    const stats = blockchainCache.getStats();

    if (!cacheEnabled) {
      return 'DISABLED';
    }

    if (stats.hits + stats.misses === 0) {
      return 'INITIALIZED';
    }

    if (stats.hitRate >= 70) {
      return 'HEALTHY';
    }

    if (stats.hitRate >= 40) {
      return 'DEGRADED';
    }

    return 'UNHEALTHY';
  }

  static logHealthStatus(): void {
    const status = this.getHealthStatus();
    const stats = blockchainCache.getStats();

    console.log(`[Cache Health] Status: ${status}`);
    console.log(`[Cache Health] Hit Rate: ${stats.hitRate.toFixed(1)}%`);
    console.log(`[Cache Health] Size: ${blockchainCache.getSize()} entries`);
  }
}

async function printCacheHealth(): Promise<void> {
  const result = await CacheHealthCheck.runHealthCheck();
  console.group('Cache Health Check');
  console.log('Status:', result.healthy ? 'HEALTHY' : 'UNHEALTHY');
  result.checks.forEach((check) => {
    console.log(`  ${check.name}: ${check.status.toUpperCase()} - ${check.message}`);
  });
  console.groupEnd();
}

export { printCacheHealth };

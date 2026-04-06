import { blockchainCache } from './blockchain-cache';

export interface CacheMetrics {
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  avgResponseTime: number;
  peakMemoryUsage: number;
  totalRequests: number;
  timestamp: number;
}

type BlockchainCacheType = typeof blockchainCache;

class CacheMetricsCollector {
  private responseTimes: number[] = [];
  private peakMemory = 0;
  private sessionStartTime = Date.now();

  recordResponseTime(duration: number): void {
    this.responseTimes.push(duration);
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }
  }

  getAverageResponseTime(): number {
    if (this.responseTimes.length === 0) return 0;
    const sum = this.responseTimes.reduce((a, b) => a + b, 0);
    return sum / this.responseTimes.length;
  }

  recordMemoryUsage(bytes: number): void {
    this.peakMemory = Math.max(this.peakMemory, bytes);
  }

  getMetrics(cache: BlockchainCacheType): CacheMetrics {
    const stats = cache.getStats();
    return {
      totalHits: stats.hits,
      totalMisses: stats.misses,
      hitRate: stats.hitRate ?? 0,
      avgResponseTime: this.getAverageResponseTime(),
      peakMemoryUsage: this.peakMemory,
      totalRequests: stats.hits + stats.misses,
      timestamp: Date.now(),
    };
  }

  reset(): void {
    this.responseTimes = [];
    this.peakMemory = 0;
    this.sessionStartTime = Date.now();
  }

  getSummary(cache: BlockchainCacheType): string {
    const metrics = this.getMetrics(cache);
    return `
Cache Metrics Summary:
  Hit Rate: ${metrics.hitRate.toFixed(2)}%
  Total Requests: ${metrics.totalRequests}
  Avg Response Time: ${metrics.avgResponseTime.toFixed(2)}ms
  Peak Memory: ${(metrics.peakMemoryUsage / 1024).toFixed(2)} KB
  Session Duration: ${((Date.now() - this.sessionStartTime) / 1000).toFixed(1)}s
    `;
  }
}

export const cacheMetricsCollector = new CacheMetricsCollector();

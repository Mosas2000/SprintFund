import { useEffect, useState, useCallback } from 'react';
import { blockchainCache } from '../lib/blockchain-cache';
import { cacheMetricsCollector } from '../lib/cache-metrics';
import { cacheConfigManager } from '../lib/cache-config';
import type { CacheMetrics } from '../lib/cache-metrics';

export function useCacheMetrics() {
  const [metrics, setMetrics] = useState<CacheMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const startMonitoring = useCallback(() => {
    if (!cacheConfigManager.metricsEnabled()) {
      console.warn('Cache metrics not enabled');
      return;
    }

    setIsMonitoring(true);

    const interval = setInterval(() => {
      const currentMetrics = cacheMetricsCollector.getMetrics(blockchainCache);
      setMetrics(currentMetrics);
    }, cacheConfigManager.getConfig().metricsUpdateIntervalMs);

    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    setMetrics(null);
  }, []);

  const getSummary = useCallback(() => {
    return cacheMetricsCollector.getSummary(blockchainCache);
  }, []);

  const resetMetrics = useCallback(() => {
    blockchainCache.resetStats();
    cacheMetricsCollector.reset();
    setMetrics(null);
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (cacheConfigManager.metricsEnabled()) {
      cleanup = startMonitoring();
    }

    return () => {
      cleanup?.();
    };
  }, [startMonitoring]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getSummary,
    resetMetrics,
  };
}

export function useCacheStats() {
  const [cacheSize, setCacheSize] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCacheSize(blockchainCache.getSize());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    cacheSize,
    clear: () => blockchainCache.clear(),
  };
}

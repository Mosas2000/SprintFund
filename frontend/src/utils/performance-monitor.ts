export interface PerformanceMetrics {
  dataFetchTime: number;
  chartRenderTime: number;
  totalLoadTime: number;
  cacheHitRate: number;
}

class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private startTimes: Map<string, number> = new Map();

  start(label: string): void {
    this.startTimes.set(label, performance.now());
  }

  end(label: string): number {
    const startTime = this.startTimes.get(label);
    if (!startTime) {
      console.warn(`Performance marker "${label}" was never started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    const metrics = this.metrics.get(label) || [];
    metrics.push(duration);
    this.metrics.set(label, metrics);
    this.startTimes.delete(label);

    return duration;
  }

  getAverage(label: string): number {
    const metrics = this.metrics.get(label) || [];
    if (metrics.length === 0) return 0;
    return metrics.reduce((a, b) => a + b, 0) / metrics.length;
  }

  getAll(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((values, key) => {
      result[key] = this.getAverage(key);
    });
    return result;
  }

  clear(): void {
    this.metrics.clear();
    this.startTimes.clear();
  }

  report(): string {
    const all = this.getAll();
    return Object.entries(all)
      .map(([key, value]) => `${key}: ${value.toFixed(2)}ms`)
      .join('\n');
  }
}

export const performanceMonitor = new PerformanceMonitor();

import { AsyncError, ErrorCode } from '../lib/async-errors';

export class ErrorMetricsCollector {
  private metrics = {
    totalErrors: 0,
    errorsByCode: new Map<ErrorCode, number>(),
    retryCount: 0,
    successAfterRetry: 0,
    lastError: null as AsyncError | null,
    lastErrorTime: 0,
    errorTimeseries: [] as Array<{ time: number; code: ErrorCode }>,
  };

  private readonly maxTimeseriesPoints = 1000;

  recordError(error: AsyncError): void {
    this.metrics.totalErrors++;
    this.metrics.lastError = error;
    this.metrics.lastErrorTime = Date.now();

    const count = this.metrics.errorsByCode.get(error.code as ErrorCode) || 0;
    this.metrics.errorsByCode.set(error.code as ErrorCode, count + 1);

    this.metrics.errorTimeseries.push({
      time: Date.now(),
      code: error.code as ErrorCode,
    });

    if (this.metrics.errorTimeseries.length > this.maxTimeseriesPoints) {
      this.metrics.errorTimeseries.shift();
    }
  }

  recordRetry(): void {
    this.metrics.retryCount++;
  }

  recordSuccessAfterRetry(): void {
    this.metrics.successAfterRetry++;
  }

  getMetrics() {
    return {
      totalErrors: this.metrics.totalErrors,
      retryCount: this.metrics.retryCount,
      successAfterRetry: this.metrics.successAfterRetry,
      successRetryRate:
        this.metrics.retryCount > 0
          ? (this.metrics.successAfterRetry / this.metrics.retryCount) * 100
          : 0,
      lastError: this.metrics.lastError,
      lastErrorTime: this.metrics.lastErrorTime,
      errorsByCode: Object.fromEntries(this.metrics.errorsByCode),
      topError: Array.from(this.metrics.errorsByCode.entries()).sort(
        (a, b) => b[1] - a[1],
      )[0]?.[0],
    };
  }

  getErrorFrequency(windowMs: number = 60000): number {
    const now = Date.now();
    const recentErrors = this.metrics.errorTimeseries.filter(
      (e) => now - e.time < windowMs,
    ).length;
    return (recentErrors / (windowMs / 1000)) * 60;
  }

  reset(): void {
    this.metrics = {
      totalErrors: 0,
      errorsByCode: new Map(),
      retryCount: 0,
      successAfterRetry: 0,
      lastError: null,
      lastErrorTime: 0,
      errorTimeseries: [],
    };
  }

  export() {
    return JSON.stringify(this.getMetrics(), null, 2);
  }
}

export const errorMetrics = new ErrorMetricsCollector();

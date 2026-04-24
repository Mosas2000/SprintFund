import { AsyncError } from '../lib/async-errors';
import { errorLogger } from '../lib/error-logger';
import { errorMetrics } from '../lib/error-metrics';
import { getOrCreateCircuitBreaker } from '../lib/circuit-breaker';

export interface ErrorHandlingConfig {
  enableLogging?: boolean;
  enableMetrics?: boolean;
  enableCircuitBreaker?: boolean;
  logEndpoint?: string;
  circuitBreakerThreshold?: number;
}

import { normalizeError } from '../lib/error-normalizer';
import type { NormalizedError } from '../lib/error-normalizer';

class ErrorHandlingManager {
  private config: ErrorHandlingConfig = {
    enableLogging: true,
    enableMetrics: true,
    enableCircuitBreaker: true,
  };

  configure(config: Partial<ErrorHandlingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  handleError(
    error: AsyncError,
    context: Record<string, unknown> = {},
  ): void {
    const normalized = normalizeError(error);
    const enrichedContext = {
      ...context,
      normalizedMessage: normalized.message,
      normalizedSeverity: normalized.severity,
      contractCode: normalized.contractCode,
    };

    if (this.config.enableLogging) {
      errorLogger.log(error, enrichedContext);
    }

    if (this.config.enableMetrics) {
      errorMetrics.recordError(error);
    }
  }

  getNormalizedError(error: unknown): NormalizedError {
    return normalizeError(error);
  }

  async executeWithCircuitBreaker<T>(
    key: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    if (!this.config.enableCircuitBreaker) {
      return fn();
    }

    const breaker = getOrCreateCircuitBreaker(
      key,
      this.config.circuitBreakerThreshold,
    );

    return breaker.execute(fn);
  }

  getMetrics() {
    return errorMetrics.getMetrics();
  }

  getLogs() {
    return errorLogger.getLogs();
  }

  async sendLogsToServer(): Promise<void> {
    if (this.config.logEndpoint) {
      await errorLogger.sendToServer(this.config.logEndpoint);
    }
  }

  reset(): void {
    errorLogger.clearLogs();
    errorMetrics.reset();
  }
}

export const errorHandlingManager = new ErrorHandlingManager();

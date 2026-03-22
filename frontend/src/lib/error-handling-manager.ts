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
    if (this.config.enableLogging) {
      errorLogger.log(error, context);
    }

    if (this.config.enableMetrics) {
      errorMetrics.recordError(error);
    }
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

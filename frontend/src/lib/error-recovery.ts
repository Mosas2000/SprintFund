import { AsyncError, ErrorCode, isRetryableError } from '../lib/async-errors';

export interface RecoveryStrategy {
  name: string;
  apply: () => Promise<void>;
}

export class ErrorRecoveryManager {
  private strategies: Map<ErrorCode, RecoveryStrategy[]> = new Map();
  private retryQueue: Array<() => Promise<void>> = [];

  registerStrategy(errorCode: ErrorCode, strategy: RecoveryStrategy): void {
    if (!this.strategies.has(errorCode)) {
      this.strategies.set(errorCode, []);
    }
    this.strategies.get(errorCode)?.push(strategy);
  }

  async recover(error: AsyncError): Promise<boolean> {
    const strategies = this.strategies.get(error.code as ErrorCode);

    if (!strategies || strategies.length === 0) {
      return false;
    }

    try {
      for (const strategy of strategies) {
        await strategy.apply();
      }
      return true;
    } catch {
      return false;
    }
  }

  queueForRetry(fn: () => Promise<void>): void {
    this.retryQueue.push(fn);
  }

  async processRetryQueue(): Promise<void> {
    while (this.retryQueue.length > 0) {
      const fn = this.retryQueue.shift();
      if (fn) {
        try {
          await fn();
        } catch {
          this.retryQueue.push(fn);
          break;
        }
      }
    }
  }

  clearRetryQueue(): void {
    this.retryQueue = [];
  }

  getRetryQueueSize(): number {
    return this.retryQueue.length;
  }
}

export const defaultRecoveryManager = new ErrorRecoveryManager();

defaultRecoveryManager.registerStrategy(
  ErrorCode.NETWORK_ERROR,
  {
    name: 'Wait for network',
    apply: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    },
  },
);

defaultRecoveryManager.registerStrategy(
  ErrorCode.TIMEOUT_ERROR,
  {
    name: 'Increase timeout',
    apply: async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
  },
);

defaultRecoveryManager.registerStrategy(
  ErrorCode.RATE_LIMIT,
  {
    name: 'Wait before retry',
    apply: async () => {
      await new Promise((resolve) => setTimeout(resolve, 10000));
    },
  },
);

export function getRecoveryStrategies(error: AsyncError): RecoveryStrategy[] {
  return defaultRecoveryManager['strategies'].get(error.code as ErrorCode) || [];
}

import { AsyncError, ErrorCode } from '../lib/async-errors';

interface CircuitBreakerState {
  status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  successCount: number;
  lastFailureTime?: number;
  nextAttemptTime?: number;
}

export class CircuitBreaker {
  private state: CircuitBreakerState = {
    status: 'CLOSED',
    failureCount: 0,
    successCount: 0,
  };

  private readonly failureThreshold: number;
  private readonly successThreshold: number;
  private readonly timeout: number;

  constructor(
    failureThreshold: number = 5,
    successThreshold: number = 2,
    timeout: number = 60000,
  ) {
    this.failureThreshold = failureThreshold;
    this.successThreshold = successThreshold;
    this.timeout = timeout;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state.status === 'OPEN') {
      if (Date.now() < (this.state.nextAttemptTime || 0)) {
        throw new AsyncError(
          'Circuit breaker is OPEN. Service temporarily unavailable.',
          ErrorCode.UNKNOWN,
        );
      }
      this.state.status = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.state.failureCount = 0;

    if (this.state.status === 'HALF_OPEN') {
      this.state.successCount++;
      if (this.state.successCount >= this.successThreshold) {
        this.state.status = 'CLOSED';
        this.state.successCount = 0;
      }
    }
  }

  private onFailure(): void {
    this.state.lastFailureTime = Date.now();
    this.state.failureCount++;

    if (this.state.failureCount >= this.failureThreshold) {
      this.state.status = 'OPEN';
      this.state.nextAttemptTime = Date.now() + this.timeout;
      this.state.failureCount = 0;
      this.state.successCount = 0;
    }
  }

  getState(): CircuitBreakerState {
    return { ...this.state };
  }

  reset(): void {
    this.state = {
      status: 'CLOSED',
      failureCount: 0,
      successCount: 0,
    };
  }

  isClosed(): boolean {
    return this.state.status === 'CLOSED';
  }

  isOpen(): boolean {
    return this.state.status === 'OPEN';
  }

  isHalfOpen(): boolean {
    return this.state.status === 'HALF_OPEN';
  }
}

const circuitBreakers = new Map<string, CircuitBreaker>();

export function getOrCreateCircuitBreaker(
  key: string,
  failureThreshold?: number,
  successThreshold?: number,
  timeout?: number,
): CircuitBreaker {
  if (!circuitBreakers.has(key)) {
    circuitBreakers.set(
      key,
      new CircuitBreaker(failureThreshold, successThreshold, timeout),
    );
  }
  return circuitBreakers.get(key)!;
}

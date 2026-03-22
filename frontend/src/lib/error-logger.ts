import { AsyncError, ErrorCode } from '../lib/async-errors';

export interface ErrorLog {
  id: string;
  timestamp: number;
  error: AsyncError;
  context: Record<string, unknown>;
  stack?: string;
  userAgent: string;
  url: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;
  private onErrorCallbacks: Array<(log: ErrorLog) => void> = [];

  log(error: AsyncError, context: Record<string, unknown> = {}): ErrorLog {
    const errorLog: ErrorLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      error,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    };

    this.logs.push(errorLog);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.onErrorCallbacks.forEach((callback) => {
      try {
        callback(errorLog);
      } catch {
      }
    });

    console.error(`[${errorLog.id}]`, error.message, {
      code: error.code,
      context,
    });

    return errorLog;
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  getLogsByCode(code: ErrorCode): ErrorLog[] {
    return this.logs.filter((log) => log.error.code === code);
  }

  clearLogs(): void {
    this.logs = [];
  }

  onError(callback: (log: ErrorLog) => void): () => void {
    this.onErrorCallbacks.push(callback);
    return () => {
      const index = this.onErrorCallbacks.indexOf(callback);
      if (index > -1) {
        this.onErrorCallbacks.splice(index, 1);
      }
    };
  }

  async sendToServer(endpoint: string): Promise<void> {
    if (this.logs.length === 0) return;

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logs: this.logs,
          timestamp: Date.now(),
        }),
      });
    } catch {
    }
  }

  getErrorStats() {
    const stats = {
      total: this.logs.length,
      byCode: {} as Record<string, number>,
      recent: this.logs.slice(-5),
      averageFrequency: 0,
    };

    this.logs.forEach((log) => {
      stats.byCode[log.error.code] = (stats.byCode[log.error.code] || 0) + 1;
    });

    if (this.logs.length > 1) {
      const timeSpan = this.logs[this.logs.length - 1].timestamp - this.logs[0].timestamp;
      stats.averageFrequency = this.logs.length / (timeSpan / 1000 / 60);
    }

    return stats;
  }
}

export const errorLogger = new ErrorLogger();

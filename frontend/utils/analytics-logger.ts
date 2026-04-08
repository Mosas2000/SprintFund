export interface AnalyticsLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: unknown;
  component?: string;
}

class AnalyticsLogger {
  private logs: AnalyticsLog[] = [];
  private maxLogs: number = 100;
  private isDevelopment: boolean = process.env.NODE_ENV === 'development';

  log(message: string, data?: unknown, component?: string): void {
    this.addLog('info', message, data, component);
  }

  warn(message: string, data?: unknown, component?: string): void {
    this.addLog('warn', message, data, component);
  }

  error(message: string, data?: unknown, component?: string): void {
    this.addLog('error', message, data, component);
  }

  debug(message: string, data?: unknown, component?: string): void {
    if (this.isDevelopment) {
      this.addLog('debug', message, data, component);
    }
  }

  private addLog(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    data?: unknown,
    component?: string
  ): void {
    const log: AnalyticsLog = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      component,
    };

    this.logs.push(log);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    if (this.isDevelopment) {
      const color = this.getColorForLevel(level);
      console.log(
        `%c[${component || 'Analytics'}] ${message}`,
        `color: ${color}; font-weight: bold`,
        data
      );
    }
  }

  private getColorForLevel(level: string): string {
    switch (level) {
      case 'error':
        return '#ff4444';
      case 'warn':
        return '#ffaa00';
      case 'debug':
        return '#4488ff';
      default:
        return '#00aa44';
    }
  }

  getLogs(filter?: { level?: string; component?: string }): AnalyticsLog[] {
    if (!filter) return this.logs;

    return this.logs.filter((log) => {
      if (filter.level && log.level !== filter.level) return false;
      if (filter.component && log.component !== filter.component) return false;
      return true;
    });
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  getStatistics(): {
    total: number;
    byLevel: Record<string, number>;
    byComponent: Record<string, number>;
  } {
    const byLevel: Record<string, number> = {
      info: 0,
      warn: 0,
      error: 0,
      debug: 0,
    };
    const byComponent: Record<string, number> = {};

    this.logs.forEach((log) => {
      byLevel[log.level] = (byLevel[log.level] || 0) + 1;
      const comp = log.component || 'Unknown';
      byComponent[comp] = (byComponent[comp] || 0) + 1;
    });

    return {
      total: this.logs.length,
      byLevel,
      byComponent,
    };
  }
}

export const analyticsLogger = new AnalyticsLogger();

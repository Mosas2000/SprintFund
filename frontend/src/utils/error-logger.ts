import { ErrorInfo } from 'react';

export interface ErrorLog {
  timestamp: string;
  component: string;
  error: string;
  errorInfo?: ErrorInfo;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 50;

  log(
    component: string,
    error: Error,
    errorInfo?: ErrorInfo,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) {
    const logEntry: ErrorLog = {
      timestamp: new Date().toISOString(),
      component,
      error: error.message,
      errorInfo,
      severity,
    };

    this.logs.push(logEntry);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    this.sendToServer(logEntry);
  }

  getLogs(): ErrorLog[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  getLogsByComponent(component: string): ErrorLog[] {
    return this.logs.filter((log) => log.component === component);
  }

  getLogsBySeverity(severity: string): ErrorLog[] {
    return this.logs.filter((log) => log.severity === severity);
  }

  private sendToServer(logEntry: ErrorLog) {
    if (typeof window === 'undefined') return;

    try {
      fetch('/api/error-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
      }).catch(() => {
        console.debug('Failed to send error log to server');
      });
    } catch (error) {
      console.debug('Error logger fetch failed:', error);
    }
  }
}

export const errorLogger = new ErrorLogger();

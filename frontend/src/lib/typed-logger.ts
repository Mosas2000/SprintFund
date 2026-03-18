/**
 * Type-safe structured logging utilities.
 */

/**
 * Log levels.
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Log event with metadata.
 */
export interface LogEvent {
  level: LogLevel;
  timestamp: number;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Structured logger with type safety.
 */
export class Logger {
  private level: LogLevel;
  private listeners: Array<(event: LogEvent) => void> = [];

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  /**
   * Subscribe to log events.
   */
  subscribe(listener: (event: LogEvent) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Emit log event.
   */
  private emit(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (level < this.level) return;

    const event: LogEvent = {
      level,
      timestamp: Date.now(),
      message,
      context,
      error,
    };

    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Logger listener error:', err);
      }
    });
  }

  /**
   * Log debug message.
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.emit(LogLevel.DEBUG, message, context);
    console.debug(message, context);
  }

  /**
   * Log info message.
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.emit(LogLevel.INFO, message, context);
    console.info(message, context);
  }

  /**
   * Log warning message.
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.emit(LogLevel.WARN, message, context);
    console.warn(message, context);
  }

  /**
   * Log error.
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.emit(LogLevel.ERROR, message, context, error);
    console.error(message, error, context);
  }

  /**
   * Set log level.
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }
}

/**
 * Global logger instance.
 */
export const logger = new Logger(
  process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
);

/**
 * Type-safe timer for performance tracking.
 */
export class TypedTimer {
  private start: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.start = performance.now();
  }

  /**
   * Get elapsed time in milliseconds.
   */
  elapsed(): number {
    return Math.round(performance.now() - this.start);
  }

  /**
   * Log elapsed time and return duration.
   */
  end(): number {
    const duration = this.elapsed();
    logger.debug(`Timer ${this.label}: ${duration}ms`);
    return duration;
  }

  /**
   * Mark a checkpoint.
   */
  mark(name: string): number {
    const elapsed = this.elapsed();
    logger.debug(`Checkpoint ${this.label}/${name}: ${elapsed}ms`);
    return elapsed;
  }
}

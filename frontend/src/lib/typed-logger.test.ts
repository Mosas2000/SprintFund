import { describe, it, expect, vi } from 'vitest';
import { Logger, LogLevel, TypedTimer } from './typed-logger';
import type { LogEvent } from './typed-logger';

describe('Logger', () => {
  let logger: Logger;
  let events: LogEvent[] = [];

  beforeEach(() => {
    logger = new Logger(LogLevel.DEBUG);
    events = [];
    logger.subscribe((event) => {
      events.push(event);
    });
  });

  describe('logging levels', () => {
    it('logs debug messages', () => {
      logger.debug('Debug message');
      expect(events).toHaveLength(1);
      expect(events[0].level).toBe(LogLevel.DEBUG);
    });

    it('logs info messages', () => {
      logger.info('Info message');
      expect(events).toHaveLength(1);
      expect(events[0].level).toBe(LogLevel.INFO);
    });

    it('logs warning messages', () => {
      logger.warn('Warning message');
      expect(events).toHaveLength(1);
      expect(events[0].level).toBe(LogLevel.WARN);
    });

    it('logs error messages', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);
      expect(events).toHaveLength(1);
      expect(events[0].level).toBe(LogLevel.ERROR);
      expect(events[0].error).toBe(error);
    });
  });

  describe('log filtering', () => {
    it('respects minimum log level', () => {
      const warnLogger = new Logger(LogLevel.WARN);
      warnLogger.subscribe((e) => events.push(e));

      warnLogger.debug('Debug'); // Should not log
      warnLogger.warn('Warning'); // Should log
      warnLogger.error('Error'); // Should log

      expect(events).toHaveLength(2);
    });
  });

  describe('context', () => {
    it('includes context in log events', () => {
      const context = { userId: 123, action: 'vote' };
      logger.info('User voted', context);

      expect(events[0].context).toEqual(context);
    });
  });

  describe('subscriptions', () => {
    it('calls all subscribed listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      logger.subscribe(listener1);
      logger.subscribe(listener2);

      logger.info('Test');

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });
});

describe('TypedTimer', () => {
  it('measures elapsed time', async () => {
    const timer = new TypedTimer('test');
    await new Promise((resolve) => setTimeout(resolve, 50));
    const elapsed = timer.elapsed();

    expect(elapsed).toBeGreaterThanOrEqual(50);
    expect(elapsed).toBeLessThan(200); // Allow some variance
  });

  it('tracks checkpoints', async () => {
    const timer = new TypedTimer('test');
    await new Promise((resolve) => setTimeout(resolve, 25));
    const checkpoint1 = timer.mark('checkpoint1');
    await new Promise((resolve) => setTimeout(resolve, 25));
    const checkpoint2 = timer.mark('checkpoint2');

    expect(checkpoint2).toBeGreaterThan(checkpoint1);
  });

  it('logs elapsed time on end', () => {
    const logger = new Logger();
    const events: LogEvent[] = [];
    logger.subscribe((e) => events.push(e));

    const timer = new TypedTimer('test');
    timer.end();

    expect(events).toHaveLength(1);
    expect(events[0].level).toBe(LogLevel.DEBUG);
  });
});

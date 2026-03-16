import { describe, it, expect } from 'vitest';
import { formatTimeAgo } from './notification-time';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

describe('formatTimeAgo', () => {
  const now = 1700000000000;

  it('returns "just now" for timestamps in the future', () => {
    expect(formatTimeAgo(now + 5000, now)).toBe('just now');
  });

  it('returns "just now" for timestamps less than a minute ago', () => {
    expect(formatTimeAgo(now - 30_000, now)).toBe('just now');
    expect(formatTimeAgo(now, now)).toBe('just now');
  });

  it('returns singular "1 min ago" for exactly one minute', () => {
    expect(formatTimeAgo(now - MINUTE, now)).toBe('1 min ago');
  });

  it('returns plural minutes for 2-59 minutes', () => {
    expect(formatTimeAgo(now - 5 * MINUTE, now)).toBe('5 mins ago');
    expect(formatTimeAgo(now - 30 * MINUTE, now)).toBe('30 mins ago');
    expect(formatTimeAgo(now - 59 * MINUTE, now)).toBe('59 mins ago');
  });

  it('returns singular "1 hour ago" for exactly one hour', () => {
    expect(formatTimeAgo(now - HOUR, now)).toBe('1 hour ago');
  });

  it('returns plural hours for 2-23 hours', () => {
    expect(formatTimeAgo(now - 6 * HOUR, now)).toBe('6 hours ago');
    expect(formatTimeAgo(now - 23 * HOUR, now)).toBe('23 hours ago');
  });

  it('returns singular "1 day ago" for exactly one day', () => {
    expect(formatTimeAgo(now - DAY, now)).toBe('1 day ago');
  });

  it('returns plural days for 2-6 days', () => {
    expect(formatTimeAgo(now - 3 * DAY, now)).toBe('3 days ago');
    expect(formatTimeAgo(now - 6 * DAY, now)).toBe('6 days ago');
  });

  it('returns short date for timestamps older than a week', () => {
    const oldTimestamp = now - 2 * WEEK;
    const result = formatTimeAgo(oldTimestamp, now);
    expect(result).not.toContain('ago');
    expect(result.length).toBeGreaterThan(0);
  });

  it('uses Date.now as default when no now parameter is passed', () => {
    const recent = Date.now() - 30_000;
    expect(formatTimeAgo(recent)).toBe('just now');
  });
});
